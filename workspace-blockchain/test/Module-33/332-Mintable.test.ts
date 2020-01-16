import { should } from 'chai';
import { MintableInstance } from '../../types/truffle-contracts';

const { expectRevert } = require('@openzeppelin/test-helpers');

const Mintable = artifacts.require('./Module-33/Mintable.sol') as Truffle.Contract<MintableInstance>;
should();


/** @test {Mintable} contract */
contract('Mintable', (accounts) => {

    let mintable: MintableInstance;

    const owner = accounts[0];
    const user1 = accounts[1];
    const initialSupply = 1000000;

    beforeEach(async () => {
        mintable = await Mintable.new({ from: owner });
    });

    /**
     * Test the balance method
     * @test {Mintable#balanceOf}
     */
    /* it('Retrieve owner balance.', async () => {
        const ownerBalance = await mintable.balanceOf(owner, { from: owner });

        (ownerBalance.toNumber()).should.be.equal(initialSupply);
    }); */

    /**
     * Test the balance method
     * @test {Mintable#balanceOf}
     */
    it('Retrieve empty balance.', async () => {
        const emptyBalance = await mintable.balanceOf(user1, { from: owner });

        (emptyBalance.toNumber()).should.be.equal(0);
    });

    /**
     * Test minting.
     * @test {Mintable#mint}
     */
    it('Minting not allowed to general public.', async () => {
        await expectRevert(
            mintable.mint(initialSupply, { from: user1 }),
            'Ownable: caller is not the owner',
        );
    });

    /**
     * Test burning.
     * @test {Mintable#burn}
     */

    it('Burning above balance not allowed.', async () => {
        await expectRevert(
            mintable.burn(initialSupply, { from: user1 }),
            'Insufficient balance.',
        );
    });

    it('Burning full balance.', async () => {
        await mintable.mint(initialSupply, { from: owner });

        const transaction = await mintable.burn(initialSupply, { from: owner });
        const firstEvent = transaction.logs[0];
        const eventName = firstEvent.event;
        const eventAmount = firstEvent.args.amount;

        eventName.should.be.equal('Burned');
        eventAmount.toNumber().should.be.equal(initialSupply);

        (await mintable.balanceOf(owner)).toNumber().should.be.equal(0);
    });

    it('Burning partial balance.', async () => {
        const amountBurned = 1;
        await mintable.mint(initialSupply, { from: owner });

        await mintable.burn(amountBurned, { from: owner });

        (await mintable.balanceOf(owner)).toNumber().should.be.equal(initialSupply - amountBurned);
    });

    /**
     * Test transferring balances.
     * @test {Mintable#transfer}
     */
    it('Transfer above balance.', async () => {
        await expectRevert(
            mintable.transfer(owner, 1, { from: user1 }),
            'Insufficient balance.',
        );
    });

    it('Transfer below balance.', async () => {
        const transferredAmount = 1;
        const transaction = await mintable.transfer(user1, transferredAmount, { from: owner });
        const firstEvent = transaction.logs[0];
        const eventName = firstEvent.event;
        const eventRecipient = firstEvent.args.recipient;
        const eventAmount = firstEvent.args.amount;

        eventName.should.be.equal('Transferred');
        eventRecipient.should.be.equal(user1);
        eventAmount.toNumber().should.be.equal(transferredAmount);

        (await mintable.balanceOf(owner)).toNumber().should.be.equal(initialSupply - transferredAmount);
        (await mintable.balanceOf(user1)).toNumber().should.be.equal(transferredAmount);
    });

    it('Transfer at balance.', async () => {
        const transaction = await mintable.transfer(user1, initialSupply, { from: owner });

        (await mintable.balanceOf(owner)).toNumber().should.be.equal(0);
        (await mintable.balanceOf(user1)).toNumber().should.be.equal(initialSupply);
    });
});
