import { SimpleStorageInstance, MyErc20Instance } from '../../types/truffle-contracts';

const SimpleStorage = artifacts.require('SimpleStorage') as Truffle.Contract<SimpleStorageInstance>;
const MyErc20 = artifacts.require('MyErc20') as Truffle.Contract<MyErc20Instance>;

/** @test {SimpleStorage} contract */
contract('SimpleStorage', (accounts) => {

    let storage: SimpleStorageInstance;
    let currency: MyErc20Instance;

    const owner = accounts[0];
    const initialSupply = 1000000;
    const currencyToStore = 1000;

    beforeEach(async () => {
        currency = await MyErc20.new(initialSupply);
        storage = await SimpleStorage.new();
    });

    it('stores currency.', async () => {
        await currency.transfer(storage.address, currencyToStore, { from: owner });
        const storageBalance = (await currency.balanceOf(storage.address)).toNumber();
        const ownerBalance = (await currency.balanceOf(owner)).toNumber();
        assert.equal(storageBalance, currencyToStore);
        assert.equal(ownerBalance, initialSupply - currencyToStore);
    });
});
