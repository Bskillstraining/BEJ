import { should } from 'chai';
import { UserTableInstance } from '../../types/truffle-contracts';

should();

const UserTable = artifacts.require('./Module-32/UserTable.sol') as Truffle.Contract<UserTableInstance>;

/** @test {UserTable} contract */
contract('UserTable', (accounts) => {

    let userTable: UserTableInstance;
    const userOne = accounts[1];
    const userTwo = accounts[2];
    const valueOne = 42;
    const valueTwo = 43;


    beforeEach(async () => {
        userTable = await UserTable.new();
    });

    /**
     * Test the two contract methods
     * @test {UserTable#set} and {UserTable#get}
     */
    it('Store and retrieve a value.', async () => {
        await userTable.set(valueOne, { from: userOne });
        await userTable.set(valueTwo, { from: userTwo });
        const storedValueOne = await userTable.get({ from: userOne });
        const storedValueTwo = await userTable.get({ from: userTwo });

        (storedValueOne.toNumber()).should.be.equal(valueOne);
        (storedValueTwo.toNumber()).should.be.equal(valueTwo);
    });
});
