import { HoldingsInstance, MyERC20Instance } from '../../types/truffle-contracts';

const { expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

const Holdings = artifacts.require('Holdings') as Truffle.Contract<HoldingsInstance>;
const MyERC20 = artifacts.require('MyERC20') as Truffle.Contract<MyERC20Instance>;

/** @test {Holdings} contract */
contract('Holdings', (accounts) => {

    let holdings: HoldingsInstance;
    let currency: MyERC20Instance;

    const owner = accounts[0];
    const user1 = accounts[1];
    const user2 = accounts[2];
    const initialSupply = 1000000;
    const currencyToStore = 1000;

    beforeEach(async () => {
        currency = await MyERC20.new(initialSupply);
        holdings = await Holdings.new(currency.address);
        await currency.transfer(user1, initialSupply/2, { from: owner });
        await currency.transfer(user2, initialSupply/2, { from: owner });
    });

    /**
     * Test the constructors
     * @test {MyERC20#constructor}
     */
    /* it('initializes contracts.', async () => {
        const ownerBalance = await currency.balanceOf(owner, { from: owner });
        assert.equal(ownerBalance.toNumber(), initialSupply);
        assert.equal(holdings.currencyToken(), currency.address);
    }); */

    it('does not allow releasing if not stored.', async () => {
        await expectRevert(
            holdings.release(user2, { from: user1 }),
            'Not holding.',
        );
    });

    it('stores currency.', async () => {
        await currency.approve(holdings.address, currencyToStore, { from: user1 });
        expectEvent(
            await holdings.store(currencyToStore, { from: user1 }),
            'Transfer',
            {
                from: user1.toString(),
                to: currency.address.toString(),
                value: currencyToStore.toString(),
            },
        );
        const balance = await currency.balanceOf(user1, { from: owner });
        assert.equal(balance.toNumber(), 0);
    });

    describe('holding currency', () => {
        beforeEach(async () => {
            await currency.approve(holdings.address, currencyToStore, { from: user1 });
            await holdings.store(currencyToStore, { from: user1 });
        });
        
        it('does not allow storing if already holding.', async () => {
            await expectRevert(
                holdings.store(currencyToStore, { from: user1 }),
                'Already holding.',
            );
        });

        it('releases currency.', async () => {
            expectEvent(
                await holdings.release(user2, { from: user1 }),
                'Transfer',
                {
                    from: currency.address.toString(),
                    to: user2.toString(),
                    value: currencyToStore.toString(),
                },
            );
            const balance = await currency.balanceOf(user2, { from: owner });
            assert.equal(balance.toNumber(), initialSupply);
        });
    });
});
