import { should } from 'chai';
import { MintableInstance } from '../../types/truffle-contracts';
import { SafeMintableInstance } from '../../types/truffle-contracts';

const { BN, expectRevert } = require('@openzeppelin/test-helpers');

const Mintable = artifacts.require('Mintable') as Truffle.Contract<MintableInstance>;
const SafeMintable = artifacts.require('SafeMintable') as Truffle.Contract<SafeMintableInstance>;

should();

/** @test {Mintable} contract */
contract('Mintable', (accounts) => {

    let mintable: MintableInstance;

    const owner = accounts[0];
    const user1 = accounts[1];
    const user2 = accounts[2];
    const initialSupply = 1000000;

    beforeEach(async () => {
        mintable = await Mintable.new({ from: owner });
        await mintable.mint(initialSupply, { from: owner });
    });

    /**
     * Test the balance method
     * @test {SafeMintable#balanceOf}
     */
    it('Exploit for free tokens.', async () => {
        const zeroTokens = 0;
        const oneToken = 1;
        const twoTokens = 2;
        await mintable.transfer(user1, oneToken, { from: owner });
        await mintable.transfer(user2, twoTokens, { from: user1 });
        console.log('Balance user1: ' + (await mintable.balanceOf(user1)).toString());
        console.log('Balance user2: ' + (await mintable.balanceOf(user2)).toString());
    });
});

/** @test {SafeMintable} contract */
contract('SafeMintable', (accounts) => {

    let safeMintable: SafeMintableInstance;

    const owner = accounts[0];
    const user1 = accounts[1];
    const initialSupply = 1000000;

    beforeEach(async () => {
        safeMintable = await SafeMintable.new({ from: owner });
    });

    /**
     * Test the balance method
     * @test {SafeMintable#balanceOf}
     */
    it('Retrieve empty balance.', async () => {
        const emptyBalance = await safeMintable.balanceOf(user1, { from: owner });

        (emptyBalance.toNumber()).should.be.equal(0);
    });

    /**
     * Test minting.
     * @test {SafeMintable#mint}
     */
    it('Minting not allowed to general public.', async () => {
        await expectRevert(
            safeMintable.mint(initialSupply, { from: user1 }),
            'Ownable: caller is not the owner',
        );
    });

    it('Minting initial supply.', async () => {
        const transaction = await safeMintable.mint(initialSupply, { from: owner });

        const firstEvent = transaction.logs[0];
        const eventName = firstEvent.event;
        const eventAmount = firstEvent.args.amount;

        eventName.should.be.equal('Minted');
        eventAmount.toNumber().should.be.equal(initialSupply);

        (await safeMintable.balanceOf(owner)).toNumber().should.be.equal(initialSupply);
    });

    /**
     * Test burning.
     * @test {SafeMintable#burn}
     */

    it('Burning above balance not allowed.', async () => {
        await expectRevert(
            safeMintable.burn(initialSupply, { from: user1 }),
            'SafeMath: subtraction overflow',
        );
    });

    it('Burning full balance.', async () => {
        await safeMintable.mint(initialSupply, { from: owner });

        const transaction = await safeMintable.burn(initialSupply, { from: owner });
        const firstEvent = transaction.logs[0];
        const eventName = firstEvent.event;
        const eventAmount = firstEvent.args.amount;

        eventName.should.be.equal('Burned');
        eventAmount.toNumber().should.be.equal(initialSupply);

        (await safeMintable.balanceOf(owner)).toNumber().should.be.equal(0);
    });

    it('Burning partial balance.', async () => {
        const amountBurned = 1;
        await safeMintable.mint(initialSupply, { from: owner });

        await safeMintable.burn(amountBurned, { from: owner });

        (await safeMintable.balanceOf(owner)).toNumber().should.be.equal(initialSupply - amountBurned);
    });

    /**
     * Test transferring balances.
     * @test {SafeMintable#transfer}
     */
    it('Transfer above balance.', async () => {
        await expectRevert(
            safeMintable.transfer(owner, 1, { from: user1 }),
            'SafeMath: subtraction overflow',
        );
    });

    it('Transfer below balance.', async () => {
        const transferredAmount = 1;
        await safeMintable.mint(initialSupply, { from: owner });
        const transaction = await safeMintable.transfer(user1, transferredAmount, { from: owner });
        const firstEvent = transaction.logs[0];
        const eventName = firstEvent.event;
        const eventRecipient = firstEvent.args.recipient;
        const eventAmount = firstEvent.args.amount;

        eventName.should.be.equal('Transferred');
        eventRecipient.should.be.equal(user1);
        eventAmount.toNumber().should.be.equal(transferredAmount);

        (await safeMintable.balanceOf(owner)).toNumber().should.be.equal(initialSupply - transferredAmount);
        (await safeMintable.balanceOf(user1)).toNumber().should.be.equal(transferredAmount);
    });

    it('Transfer at balance.', async () => {
        await safeMintable.mint(initialSupply, { from: owner });
        const transaction = await safeMintable.transfer(user1, initialSupply, { from: owner });

        (await safeMintable.balanceOf(owner)).toNumber().should.be.equal(0);
        (await safeMintable.balanceOf(user1)).toNumber().should.be.equal(initialSupply);
    });
});
