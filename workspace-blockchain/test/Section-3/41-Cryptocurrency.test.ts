import { CryptocurrencyInstance } from '../../types/truffle-contracts';

const { expectEvent } = require('@openzeppelin/test-helpers');

const Cryptocurrency = artifacts.require('Cryptocurrency') as Truffle.Contract<CryptocurrencyInstance>;

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

        assert.equal(ownerBalance.toNumber(), initialSupply);
    });

    /**
     * Test the balance method
     * @test {Cryptocurrency#balanceOf}
     */
    it('Retrieve empty balance.', async () => {
        const emptyBalance = await cryptocurrency.balanceOf(user1, { from: owner });

        assert.equal(emptyBalance.toNumber(), 0);
    });

    /**
     * Test transferring balances.
     * @test {Cryptocurrency#transfer}
     */
    it('Transfer changes balances.', async () => {
        const transferredAmount = 10000;
        await cryptocurrency.transfer(user1, transferredAmount, { from: owner });
        assert.equal(
            (await cryptocurrency.balanceOf(owner)).toNumber(),
            initialSupply - transferredAmount,
        );
        assert.equal(
            (await cryptocurrency.balanceOf(user1)).toNumber(),
            transferredAmount,
        );
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
