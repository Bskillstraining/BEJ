import { should } from 'chai';
import { PublicStorageInstance } from '../../types/truffle-contracts';

const PublicStorage = artifacts.require('PublicStorage') as Truffle.Contract<PublicStorageInstance>;
should();


/** @test {PublicStorage} contract */
contract('PublicStorage', () => {

    let publicStorage: PublicStorageInstance;
    const valueToStore = 42;


    beforeEach(async () => {
        publicStorage = await PublicStorage.new();
    });

    /**
     * Test the contract method
     * @test {PublicStorage#set} and {PublicStorage#storedData}
     */
    it('Store and retrieve a value.', async () => {
        await publicStorage.set(valueToStore);
        const storedData = await publicStorage.storedData();

        (storedData.toNumber()).should.be.equal(valueToStore);
    });

    /**
     * Test retrieving a value before setting it.
     * @test {PublicStorage#storedData}
     */
    it('Retrieve a value before setting it.', async () => {
        const storedData = await publicStorage.storedData();

        (storedData.toNumber()).should.be.equal(0);
    });
});
