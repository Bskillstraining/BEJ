import { TokenVaultInstance, MyERC20Instance } from '../../types/truffle-contracts';

const { expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

const TokenVault = artifacts.require('TokenVault') as Truffle.Contract<TokenVaultInstance>;
const MyERC20 = artifacts.require('MyERC20') as Truffle.Contract<MyERC20Instance>;

/** @test {TokenVault} contract */
contract('TokenVault', (accounts) => {

    let holdings: TokenVaultInstance;
    let currency: MyERC20Instance;

    const owner = accounts[0];
    const user1 = accounts[1];
    const user2 = accounts[2];
    const initialSupply = 1000000;
    const userSupply = initialSupply/2;
    const currencyToStore = 1000;

    beforeEach(async () => {
        currency = await MyERC20.new(initialSupply);
        holdings = await TokenVault.new(currency.address);
        await currency.transfer(user1, userSupply, { from: owner });
    });

    it('stores currency.', async () => {
        await currency.approve(holdings.address, currencyToStore, { from: user1 });
        await holdings.store(currencyToStore, { from: user1 });

        const userBalance = await currency.balanceOf(user1, { from: owner });
        const contractBalance = await currency.balanceOf(holdings.address, { from: owner });
        assert.equal(userBalance.toNumber(), userSupply - currencyToStore);
        assert.equal(contractBalance.toNumber(), currencyToStore);
    });

    describe('holding currency', () => {
        beforeEach(async () => {
            await currency.approve(holdings.address, currencyToStore, { from: user1 });
            await holdings.store(currencyToStore, { from: user1 });
        });

        it('releases currency.', async () => {
            await holdings.release(user2, { from: user1 });

            const userBalance = await currency.balanceOf(user2, { from: owner });
            const contractBalance = await currency.balanceOf(holdings.address, { from: owner });
            assert.equal(userBalance.toNumber(), currencyToStore);
            assert.equal(contractBalance.toNumber(), 0);
        });
    });
});
