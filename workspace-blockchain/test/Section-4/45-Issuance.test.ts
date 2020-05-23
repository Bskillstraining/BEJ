import { IssuanceInstance, MyERC20Instance } from '../../types/truffle-contracts';
const Issuance = artifacts.require('Issuance') as Truffle.Contract<IssuanceInstance>;
const MyERC20 = artifacts.require('MyERC20') as Truffle.Contract<MyERC20Instance>;

// tslint:disable-next-line:no-var-requires
const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

contract('Issuance', (accounts) => {

    let issuance: IssuanceInstance;
    let currency: MyERC20Instance;

    const owner = accounts[0];
    const investorAccount = accounts[1];
    const investorBalance = new BN(100);
    const price = new BN(10);
    const investmentAmount = new BN(10);
    const tokensBought = new BN(1);

    beforeEach(async () => {
        currency = await MyERC20.new(investorBalance);
        issuance = await Issuance.new(price, currency.address);
        currency.transfer(investorAccount, investorBalance, { from: owner });
        await currency.approve(issuance.address, investmentAmount, { from: investorAccount });
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
            issuance.claim({ from: investorAccount }),
            'Cannot claim until live.',
        );
    });

    it('cannot invest a fraction of the price', async () => {
        await expectRevert(
            issuance.invest(investmentAmount.div(new BN(2)), { from: investorAccount }),
            'Cannot invest a fraction of the price.',
        );
    });

    it('can invest', async () => {
        expectEvent(
            await issuance.invest(investmentAmount, { from: investorAccount }),
            'Invested',
            {
                investment: investmentAmount,
                investor: investorAccount,
            },
        );
        assert.equal(
            (await currency.balanceOf(investorAccount)),
            investorBalance.sub(investmentAmount).toString(),
        );
        assert.equal(
            (await currency.balanceOf(issuance.address)),
            investmentAmount.toString(),
        );
    });

    describe('after investing', () => {
        beforeEach(async () => {
            await issuance.invest(investmentAmount, { from: investorAccount });
        });

        it('can invest again', async () => {
            await currency.approve(issuance.address, investmentAmount, { from: investorAccount });
            const doubleInvestment: BN = investmentAmount.add(investmentAmount);
            expectEvent(
                await issuance.invest(investmentAmount, { from: investorAccount }),
                'Invested',
                {
                    investment: doubleInvestment.toString(),
                    investor: investorAccount,
                },
            );
            assert.equal(
                (await currency.balanceOf(investorAccount)),
                investorBalance.sub(doubleInvestment).toString(),
            );
            assert.equal(
                (await currency.balanceOf(issuance.address)),
                BN(doubleInvestment).toString(), // BN bug?
            );
        });

        it('can cancel investment', async () => {
            expectEvent(
                await issuance.cancel({ from: investorAccount }),
                'Cancelled',
                {
                    investor: investorAccount,
                },
            );
        });

        it('can go live', async () => {
            expectEvent(
                await issuance.goLive({ from: owner }),
                'GoneLive',
                {
                    proceedings: investmentAmount,
                },
            );
            assert.isTrue((await issuance.live()));
            assert.equal(
                (await currency.balanceOf(owner)),
                investmentAmount.toString(),
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
                    issuance.invest(investmentAmount, { from: investorAccount }),
                    'Cannot invest if live.',
                );
            });

            it('cannot cancel investment if live', async () => {
                await expectRevert(
                    issuance.cancel({ from: investorAccount }),
                    'Cannot cancel if live.',
                );
            });

            it('can claim', async () => {
                expectEvent(
                    await issuance.claim({ from: investorAccount }),
                    'Claimed',
                    {
                        investor: investorAccount,
                        tokens: tokensBought,
                    },
                );
                assert.equal(
                    (await issuance.balanceOf(investorAccount)),
                    tokensBought.toString(),
                );
            });
        });
    });
});
