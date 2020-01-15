import { should } from 'chai';
import { ProprietaryTableInstance } from '../../types/truffle-contracts';

const { expectRevert } = require('@openzeppelin/test-helpers');

const ProprietaryTable = artifacts.require('./Module-32/ProprietaryTable.sol') as Truffle.Contract<ProprietaryTableInstance>;
should();

/** @test {ProprietaryTable} contract */
contract('ProprietaryTable', (accounts) => {

    let proprietaryTable: ProprietaryTableInstance;

    const owner = accounts[0];
    const nonOwner = accounts[1];

    const key = 42;
    const value = 43;

    beforeEach(async () => {
        proprietaryTable = await ProprietaryTable.new({ from: owner });
    });

    /**
     * Test the two contract methods
     * @test {ProprietaryTable#set} and {ProprietaryTable#get}
     */
    it('Store and retrieve a value.', async () => {
        await proprietaryTable.set(key, value, { from: owner });
        const storedValue = await proprietaryTable.get(key, { from: owner });

        (storedValue.toNumber()).should.be.equal(value);
    });

    /**
     * @test {ProprietaryTable#set}
     */
    it('Only owner can set', async () => {
        await expectRevert(
            proprietaryTable.set(key, value, { from: nonOwner }),
            'Restricted to owner.',
        );
    });
});
