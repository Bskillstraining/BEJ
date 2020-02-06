import { SimpleTableInstance } from '../../types/truffle-contracts';

const SimpleTable = artifacts.require('SimpleTable') as Truffle.Contract<SimpleTableInstance>;

/** @test {SimpleTable} contract */
contract('SimpleTable', () => {

    let simpleTable: SimpleTableInstance;
    const [ keyX, keyY, keyZ ] = [ 1, 2, 3 ];
    const [ valueX, valueY ] = [ 4, 5 ];

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
        const x = await simpleTable.get(keyX);
        const y = await simpleTable.get(keyY);

        assert.equal(x.toNumber(), valueX);
        assert.equal(y.toNumber(), valueY);
    });

    /**
     * Test retrieving a value before setting it.
     * @test {SimpleTable#get}
     */
    it('Retrieve a non existing value.', async () => {
        const z = await simpleTable.get(keyZ);

        assert.equal(z.toNumber(), 0);
    });
});
