import { should } from 'chai';
import { SimpleStorageInstance } from '../../types/truffle-contracts';


const SimpleStorage = artifacts.require('./Module-31/SimpleStorage.sol') as Truffle.Contract<SimpleStorageInstance>;
should();

/** @test {SimpleStorage} contract */
contract('SimpleStorage', (accounts) => {

    let simpleStorage: SimpleStorageInstance;
    const valueToStore = 42;


    beforeEach(async () => {
        simpleStorage = await SimpleStorage.new();
    });

    /**
     * Test the two contract methods
     * @test {SimpleStorage#set} and {SimpleStorage#get}
     */
    it('Store and retrieve a value.', async () => {
        await simpleStorage.set(valueToStore, { from: accounts[0] });
        const storedData = await simpleStorage.get();

        (storedData.toNumber()).should.be.equal(valueToStore);
    });

    /**
     * Test retrieving a value before setting it.
     * @test {SimpleStorage#get}
     */
    it('Retrieve a value before setting it.', async () => {
        const storedData = await simpleStorage.get();

        (storedData.toNumber()).should.be.equal(0);
    });
});
