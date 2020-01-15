import { should } from 'chai';
import { OwnableTableInstance } from '../../types/truffle-contracts';


const OwnableTable = artifacts.require('./Module-32/OwnableTable.sol') as Truffle.Contract<OwnableTableInstance>;
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

/** @test {PublicStorage} contract */
contract('PublicStorage', (accounts) => {

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
        await publicStorage.set(valueToStore, { from: accounts[0] });
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

/** @test {SimpleTable} contract */
contract('SimpleTable', (accounts) => {

    let simpleTable: SimpleTableInstance;
    const keyX = 1;
    const keyY = 2;
    const keyZ = 3;
    const valueX = 4;
    const valueY = 5;


    beforeEach(async () => {
        simpleTable = await SimpleTable.new();
    });

    /**
     * Test the contract method
     * @test {SimpleTable#set} and {SimpleTable#get}
     */
    it('Store and retrieve a value.', async () => {
        await simpleTable.set(keyX, valueX, { from: accounts[0] });
        await simpleTable.set(keyY, valueY, { from: accounts[0] });
        const storedValueX = await simpleTable.get(keyX);
        const storedValueY = await simpleTable.get(keyY);

        (storedValueX.toNumber()).should.be.equal(valueX);
        (storedValueY.toNumber()).should.be.equal(valueY);
    });

    /**
     * Test retrieving a value before setting it.
     * @test {SimpleTable#get}
     */
    it('Retrieve a non existing value.', async () => {
        const storedValueZ = await simpleTable.get(keyZ);

        (storedValueZ.toNumber()).should.be.equal(0);
    });
});
