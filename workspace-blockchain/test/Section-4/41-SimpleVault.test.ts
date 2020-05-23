import { SimpleVaultInstance, MyErc20Instance } from '../../types/truffle-contracts';

const SimpleVault = artifacts.require('SimpleVault') as Truffle.Contract<SimpleVaultInstance>;
const MyErc20 = artifacts.require('MyErc20') as Truffle.Contract<MyErc20Instance>;

/** @test {SimpleVault} contract */
contract('SimpleVault', (accounts) => {

    let vault: SimpleVaultInstance;
    let currency: MyErc20Instance;

    const owner = accounts[0];
    const initialSupply = 1000000;
    const currencyToStore = 1000;

    beforeEach(async () => {
        currency = await MyErc20.new(initialSupply);
        vault = await SimpleVault.new(currency.address);
    });

    it('stores currency.', async () => {
        await currency.transfer(vault.address, currencyToStore, { from: owner });
        const vaultBalance = (await currency.balanceOf(vault.address)).toNumber();
        const ownerBalance = (await currency.balanceOf(owner)).toNumber();
        assert.equal(vaultBalance, currencyToStore);
        assert.equal(ownerBalance, initialSupply - currencyToStore);
    });

    describe('storing currency', () => {
        beforeEach(async () => {
            await currency.transfer(vault.address, currencyToStore, { from: owner });
        });

        it('releases currency.', async () => {
            await vault.release({ from: owner });
            const vaultBalance = (await currency.balanceOf(vault.address)).toNumber();
            const ownerBalance = (await currency.balanceOf(owner)).toNumber();
            assert.equal(vaultBalance, 0);
            assert.equal(ownerBalance, initialSupply);
        });
    });
});
