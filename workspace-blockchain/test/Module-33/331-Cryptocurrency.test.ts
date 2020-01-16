import { should } from 'chai';
import { CryptocurrencyInstance } from '../../types/truffle-contracts';

const { expectRevert } = require('@openzeppelin/test-helpers');

const Cryptocurrency = artifacts.require('./Module-33/Cryptocurrency.sol') as Truffle.Contract<CryptocurrencyInstance>;
should();


/** @test {Cryptocurrency} contract */
contract('Cryptocurrency', (accounts) => {

    let cryptocurrency: CryptocurrencyInstance;

    const owner = accounts[0];
    const user1 = accounts[1];
    const initialSupply = 1000000;

    beforeEach(async () => {
        cryptocurrency = await Cryptocurrency.new(initialSupply);
    });

    /**
     * Test the balance method
     * @test {Cryptocurrency#balanceOf}
     */
    it('Retrieve owner balance.', async () => {
        const ownerBalance = await cryptocurrency.balanceOf(owner, { from: owner });

        (ownerBalance.toNumber()).should.be.equal(initialSupply);
    });

    /**
     * Test the balance method
     * @test {Cryptocurrency#balanceOf}
     */
    it('Retrieve empty balance.', async () => {
        const emptyBalance = await cryptocurrency.balanceOf(user1, { from: owner });

        (emptyBalance.toNumber()).should.be.equal(0);
    });

    /**
     * Test transferring balances.
     * @test {Cryptocurrency#transfer}
     */
    it('Transfer above balance.', async () => {
        await expectRevert(
            cryptocurrency.transfer(owner, 1, { from: user1 }),
            'Insufficient balance.',
        );
    });

    it('Transfer below balance.', async () => {
        const transferredAmount = 1;
        const transaction = await cryptocurrency.transfer(user1, transferredAmount, { from: owner });
        const firstEvent = transaction.logs[0];
        const eventName = firstEvent.event;
        const eventRecipient = firstEvent.args.recipient;
        const eventAmount = firstEvent.args.amount;

        eventName.should.be.equal('Transferred');
        eventRecipient.should.be.equal(user1);
        eventAmount.toNumber().should.be.equal(transferredAmount);

        (await cryptocurrency.balanceOf(owner)).toNumber().should.be.equal(initialSupply - transferredAmount);
        (await cryptocurrency.balanceOf(user1)).toNumber().should.be.equal(transferredAmount);
    });

    it('Transfer at balance.', async () => {
        const transaction = await cryptocurrency.transfer(user1, initialSupply, { from: owner });

        (await cryptocurrency.balanceOf(owner)).toNumber().should.be.equal(0);
        (await cryptocurrency.balanceOf(user1)).toNumber().should.be.equal(initialSupply);
    });
});
