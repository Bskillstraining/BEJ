import { OwnableTableInstance } from '../../types/truffle-contracts';
// tslint:disable-next-line:no-var-requires
const { expectRevert } = require('@openzeppelin/test-helpers');

const OwnableTable = artifacts.require('OwnableTable') as Truffle.Contract<OwnableTableInstance>;

/** @test {OwnableTable} contract */
contract('OwnableTable', (accounts) => {

    let ownableTable: OwnableTableInstance;

    const owner = accounts[0];
    const nonOwner = accounts[1];

    const key = 42;
    const value = 43;

    beforeEach(async () => {
        ownableTable = await OwnableTable.new({ from: owner });
    });

    /**
     * Test the two contract methods
     * @test {OwnableTable#set} and {OwnableTable#get}
     */
    it('Store and retrieve a value.', async () => {
        await ownableTable.set(key, value, { from: owner });
        const storedValue = await ownableTable.get(key, { from: owner });

        assert.equal(storedValue.toNumber(), value);
    });

    /**
     * @test {OwnableTable#set}
     */
    it('Only owner can set', async () => {
        await expectRevert(
            ownableTable.set(key, value, { from: nonOwner }),
            'Ownable: caller is not the owner',
        );
    });
});
