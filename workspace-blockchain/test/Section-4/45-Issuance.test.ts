import { IssuanceInstance, MyERC20Instance } from '../../types/truffle-contracts';
const Issuance = artifacts.require('Issuance') as Truffle.Contract<IssuanceInstance>;
const MyERC20 = artifacts.require('MyERC20') as Truffle.Contract<MyERC20Instance>;

// tslint:disable-next-line:no-var-requires
const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

contract('Issuance', (accounts) => {

    let issuance: IssuanceInstance;
    let currency: MyERC20Instance;

    const owner = accounts[0];
    const investor = accounts[1];
    const investorBalance = new BN(100);
    const price = new BN(10);
    const investment = new BN(10);
    const tokensBought = new BN(1);

    beforeEach(async () => {
        currency = await MyERC20.new(investorBalance);
        issuance = await Issuance.new(price, currency.address);
        currency.transfer(investor, investorBalance, { from: owner });
        await currency.approve(issuance.address, investment, { from: investor });
    });

    it('issuance is not live', async () => {
        assert.isFalse((await issuance.live()));
    });

    it('sets the price', async () => {
        assert.equal((await issuance.price()).toString(), price.toString());
    });

    it('sets the currency', async () => {
        assert.equal((await issuance.currency()), currency.address);
    });

    it('cannot claim if not live', async () => {
        await expectRevert(
            issuance.claim({ from: investor }),
            'Cannot claim until live.',
        );
    });

    it('cannot invest a fraction of the price', async () => {
        await expectRevert(
            issuance.invest(investment.div(new BN(2)), { from: investor }),
            'Cannot invest a fraction of the price.',
        );
    });

    it('can invest', async () => {
        expectEvent(
            await issuance.invest(investment, { from: investor }),
            'Invested',
            {
                investment: { investment },
                investor: { investor },
            },
        );
        assert.equal(
            (await currency.balanceOf(investor)),
            investorBalance.sub(investment).toString(),
        );
        assert.equal(
            (await currency.balanceOf(issuance.address)),
            investment.toString(),
        );
    });

    describe('after investing', () => {
        beforeEach(async () => {
            await issuance.invest(investment, { from: investor });
        });

        it('can invest again', async () => {
            await currency.approve(issuance.address, investment, { from: investor });
            const doubleInvestment: BN = investment.add(investment);
            expectEvent(
                await issuance.invest(investment, { from: investor }),
                'Invested',
                {
                    investment: doubleInvestment.toString(),
                    investor: { investor },
                },
            );
            assert.equal(
                (await currency.balanceOf(investor)),
                investorBalance.sub(doubleInvestment).toString(),
            );
            assert.equal(
                (await currency.balanceOf(issuance.address)),
                BN(doubleInvestment).toString(), // BN bug?
            );
        });

        it('can cancel investment', async () => {
            expectEvent(
                await issuance.cancel({ from: investor }),
                'Cancelled',
                {
                    investor: { investor },
                },
            );
        });

        it('can go live', async () => {
            expectEvent(
                await issuance.goLive({ from: owner }),
                'GoneLive',
                {
                    proceedings: investment,
                },
            );
            assert.isTrue((await issuance.live()));
            assert.equal(
                (await currency.balanceOf(owner)),
                investment.toString(),
            );
            assert.equal(
                (await currency.balanceOf(issuance.address)),
                new BN(0).toString(),
            );
        });

        describe('after going live', () => {
            beforeEach(async () => {
                await issuance.goLive({ from: owner });
            });

            it('cannot invest if live', async () => {
                await expectRevert(
                    issuance.invest(investment, { from: investor }),
                    'Cannot invest if live.',
                );
            });

            it('cannot cancel investment if live', async () => {
                await expectRevert(
                    issuance.cancel({ from: investor }),
                    'Cannot cancel if live.',
                );
            });

            it('can claim', async () => {
                expectEvent(
                    await issuance.claim({ from: investor }),
                    'Claimed',
                    {
                        investor: { investor },
                        tokens: tokensBought,
                    },
                );
                assert.equal(
                    (await issuance.balanceOf(investor)),
                    tokensBought.toString(),
                );
            });
        });
    });
});
