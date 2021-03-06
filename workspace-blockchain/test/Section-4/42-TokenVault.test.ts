import { TokenVaultInstance, MyERC20Instance } from '../../types/truffle-contracts';

const TokenVault = artifacts.require('TokenVault') as Truffle.Contract<TokenVaultInstance>;
const MyERC20 = artifacts.require('MyERC20') as Truffle.Contract<MyERC20Instance>;

/** @test {TokenVault} contract */
contract('TokenVault', (accounts) => {

    let vault: TokenVaultInstance;
    let currency: MyERC20Instance;

    const owner = accounts[0];
    const initialSupply = 1000000;
    const currencyToStore = 1000;

    beforeEach(async () => {
        currency = await MyERC20.new(initialSupply);
        vault = await TokenVault.new(currency.address);
    });

    it('deposits currency.', async () => {
        await currency.approve(vault.address, currencyToStore, { from: owner });
        await vault.deposit(currencyToStore, { from: owner });

        const ownerBalance = await currency.balanceOf(owner, { from: owner });
        const contractBalance = await currency.balanceOf(vault.address, { from: owner });
        assert.equal(ownerBalance.toNumber(), initialSupply - currencyToStore);
        assert.equal(contractBalance.toNumber(), currencyToStore);
    });

    describe('holding currency', () => {
        beforeEach(async () => {
            await currency.approve(vault.address, currencyToStore, { from: owner });
            await vault.deposit(currencyToStore, { from: owner });
        });

        it('retrieves currency.', async () => {
            await vault.retrieve({ from: owner });

            const ownerBalance = await currency.balanceOf(owner, { from: owner });
            const contractBalance = await currency.balanceOf(vault.address, { from: owner });
            assert.equal(ownerBalance.toNumber(), initialSupply);
            assert.equal(contractBalance.toNumber(), 0);
        });
    });
});
