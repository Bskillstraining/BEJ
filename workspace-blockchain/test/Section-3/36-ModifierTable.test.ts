import { ModifierTableInstance } from '../../types/truffle-contracts';

const { expectRevert } = require('@openzeppelin/test-helpers');

const ModifierTable = artifacts.require('ModifierTable') as Truffle.Contract<ModifierTableInstance>;

/** @test {ModifierTable} contract */
contract('ModifierTable', (accounts) => {

    let modifierTable: ModifierTableInstance;

    const owner = accounts[0];
    const nonOwner = accounts[1];

    const key = 42;
    const value = 43;

    beforeEach(async () => {
        modifierTable = await ModifierTable.new({ from: owner });
    });

    /**
     * Test the two contract methods
     * @test {ModifierTable#set} and {ModifierTable#get}
     */
    it('Store and retrieve a value.', async () => {
        await modifierTable.set(key, value, { from: owner });
        const storedValue = await modifierTable.get(key, { from: owner });

        assert.equal(storedValue.toNumber(), value);
    });

    /**
     * @test {ModifierTable#set}
     */
    it('Only owner can set', async () => {
        await expectRevert(
            modifierTable.set(key, value, { from: nonOwner }),
            'Restricted to owner.',
        );
    });
});
