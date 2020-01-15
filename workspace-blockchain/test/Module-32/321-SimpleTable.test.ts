import { should } from 'chai';
import { SimpleTableInstance } from '../../types/truffle-contracts';


const SimpleTable = artifacts.require('./Module-32/SimpleTable.sol') as Truffle.Contract<SimpleTableInstance>;
should();


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
