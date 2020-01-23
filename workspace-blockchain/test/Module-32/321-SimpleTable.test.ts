import { should } from 'chai';
import { SimpleTableInstance } from '../../types/truffle-contracts';

should();

const SimpleTable = artifacts.require('SimpleTable') as Truffle.Contract<SimpleTableInstance>;

/** @test {SimpleTable} contract */
contract('SimpleTable', () => {

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
        await simpleTable.set(keyX, valueX);
        await simpleTable.set(keyY, valueY);
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
