import { should } from 'chai';
import { SimpleStorageInstance } from '../../types/truffle-contracts';

should();

const SimpleStorage = artifacts.require('SimpleStorage') as Truffle.Contract<SimpleStorageInstance>;

/** @test {SimpleStorage} contract */
contract('SimpleStorage', () => {

    /**
     * Test the two contract methods
     * @test {SimpleStorage#set} and {SimpleStorage#get}
     */
    it('Store and retrieve a value.', async () => {
        const simpleStorage: SimpleStorageInstance  = await SimpleStorage.new();

        const valueToStore = 42;
        await simpleStorage.set(valueToStore);
        const storedData = await simpleStorage.get();

        (storedData.toNumber()).should.be.equal(valueToStore);
    });

    /**
     * Test retrieving a value before setting it.
     * @test {SimpleStorage#get}
     */
    it('Retrieve a value before setting it.', async () => {
        const simpleStorage: SimpleStorageInstance  = await SimpleStorage.new();

        const storedData = await simpleStorage.get();

        (storedData.toNumber()).should.be.equal(0);
    });
});
