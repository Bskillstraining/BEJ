import { SimpleTableInstance } from '../../types/truffle-contracts';

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

        assert.equal(storedValueX.toNumber(), valueX);
        assert.equal(storedValueY.toNumber(), valueY);
    });

    /**
     * Test retrieving a value before setting it.
     * @test {SimpleTable#get}
     */
    it('Retrieve a non existing value.', async () => {
        const storedValueZ = await simpleTable.get(keyZ);

        assert.equal(storedValueZ.toNumber(), 0);
    });
});
