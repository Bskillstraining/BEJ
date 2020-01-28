import { should } from 'chai';
import { CryptocurrencyInstance } from '../../types/truffle-contracts';

const { expectEvent } = require('@openzeppelin/test-helpers');

const Cryptocurrency = artifacts.require('Cryptocurrency') as Truffle.Contract<CryptocurrencyInstance>;

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
    it('Transfer changes balances.', async () => {
        const transferredAmount = 10000;
        await cryptocurrency.transfer(user1, transferredAmount, { from: owner });
        (await cryptocurrency.balanceOf(owner)).toNumber().should.be.equal(initialSupply - transferredAmount);
        (await cryptocurrency.balanceOf(user1)).toNumber().should.be.equal(transferredAmount);
    });

    /**
     * Test transferring balances.
     * @test {Cryptocurrency#transfer}
     */
    it('Transfer sends an event.', async () => {
        const transferredAmount = 10000;
        expectEvent(
            await cryptocurrency.transfer(user1, transferredAmount, { from: owner }),
            'Transferred',
            {
                amount: transferredAmount.toString(),
                recipient: user1.toString(),
            },
        );
    });
});
