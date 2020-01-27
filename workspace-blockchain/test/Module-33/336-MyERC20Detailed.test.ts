import { should } from 'chai';
import { MyERC20DetailedInstance } from '../../types/truffle-contracts';

const { expectRevert } = require('@openzeppelin/test-helpers');

const MyERC20Detailed = artifacts.require('MyERC20Detailed') as Truffle.Contract<MyERC20DetailedInstance>;

should();

/** @test {MyERC20Detailed} contract */
contract('MyERC20Detailed', (accounts) => {

    let myERC20: MyERC20DetailedInstance;

    const owner = accounts[0];
    const user1 = accounts[1];
    const zeroAddress = '0x0000000000000000000000000000000000000000';
    const initialSupply = 1000000;

    beforeEach(async () => {
        myERC20 = await MyERC20Detailed.new({ from: owner });
    });

    /**
     * Test the balance method
     * @test {MyERC20Detailed#balanceOf}
     */
    /* it('Retrieve owner balance.', async () => {
        const ownerBalance = await myERC20.balanceOf(owner, { from: owner });

        (ownerBalance.toNumber()).should.be.equal(initialSupply);
    }); */

    /**
     * Test the balance method
     * @test {MyERC20Detailed#balanceOf}
     */
    it('Retrieve empty balance.', async () => {
        const emptyBalance = await myERC20.balanceOf(user1, { from: owner });

        (emptyBalance.toNumber()).should.be.equal(0);
    });

    /**
     * Test minting.
     * @test {MyERC20Detailed#mint}
     */
    it('Minting not allowed to general public.', async () => {
        await expectRevert(
            myERC20.mint(user1, initialSupply, { from: user1 }),
            'Ownable: caller is not the owner',
        );
    });

    it('Minting initial supply.', async () => {
        const transaction = await myERC20.mint(owner, initialSupply, { from: owner });

        const firstEvent = transaction.logs[0];
        const eventName = firstEvent.event;
        const eventTo = firstEvent.args.to;
        const eventFrom = firstEvent.args.from;
        const eventValue = firstEvent.args.value;

        eventName.should.be.equal('Transfer');
        eventTo.should.be.equal(owner);
        eventFrom.should.be.equal(zeroAddress);
        eventValue.toNumber().should.be.equal(initialSupply);

        (await myERC20.balanceOf(owner)).toNumber().should.be.equal(initialSupply);
    });

    /**
     * Test burning.
     * @test {MyERC20Detailed#burn}
     */

    it('Burning above balance not allowed.', async () => {
        await expectRevert(
            myERC20.burn(initialSupply, { from: user1 }),
            'ERC20: burn amount exceeds balance',
        );
    });

    it('Burning full balance.', async () => {
        await myERC20.mint(owner, initialSupply, { from: owner });

        const transaction = await myERC20.burn(initialSupply, { from: owner });
        const firstEvent = transaction.logs[0];
        const eventName = firstEvent.event;
        const eventTo = firstEvent.args.to;
        const eventFrom = firstEvent.args.from;
        const eventValue = firstEvent.args.value;

        eventName.should.be.equal('Transfer');
        eventTo.should.be.equal(zeroAddress);
        eventFrom.should.be.equal(owner);
        eventValue.toNumber().should.be.equal(initialSupply);

        (await myERC20.balanceOf(owner)).toNumber().should.be.equal(0);
    });

    it('Burning partial balance.', async () => {
        const amountBurned = 1;
        await myERC20.mint(owner,initialSupply, { from: owner });

        await myERC20.burn(amountBurned, { from: owner });

        (await myERC20.balanceOf(owner)).toNumber().should.be.equal(initialSupply - amountBurned);
    });

    /**
     * Test transferring balances.
     * @test {MyERC20Detailed#transfer}
     */
    it('Transfer above balance.', async () => {
        await expectRevert(
            myERC20.transfer(owner, 1, { from: user1 }),
            'ERC20: transfer amount exceeds balance',
        );
    });

    it('Transfer below balance.', async () => {
        const transferredAmount = 1;
        await myERC20.mint(owner, initialSupply, { from: owner });
        const transaction = await myERC20.transfer(user1, transferredAmount, { from: owner });
        const firstEvent = transaction.logs[0];
        const eventName = firstEvent.event;
        const eventTo = firstEvent.args.to;
        const eventFrom = firstEvent.args.from;
        const eventValue = firstEvent.args.value;

        eventName.should.be.equal('Transfer');
        eventTo.should.be.equal(user1);
        eventFrom.should.be.equal(owner);
        eventValue.toNumber().should.be.equal(transferredAmount);

        (await myERC20.balanceOf(owner)).toNumber().should.be.equal(initialSupply - transferredAmount);
        (await myERC20.balanceOf(user1)).toNumber().should.be.equal(transferredAmount);
    });

    it('Transfer at balance.', async () => {
        await myERC20.mint(owner, initialSupply, { from: owner });
        const transaction = await myERC20.transfer(user1, initialSupply, { from: owner });

        (await myERC20.balanceOf(owner)).toNumber().should.be.equal(0);
        (await myERC20.balanceOf(user1)).toNumber().should.be.equal(initialSupply);
    });
});
