import { MintableInstance } from '../../types/truffle-contracts';

const { expectRevert, expectEvent } = require('@openzeppelin/test-helpers');

const Mintable = artifacts.require('Mintable') as Truffle.Contract<MintableInstance>;

/** @test {Mintable} contract */
contract('Mintable', (accounts) => {

    let mintable: MintableInstance;

    const owner = accounts[0];
    const user1 = accounts[1];
    const initialSupply = 0;
    const currencyToMint = 1000000;

    beforeEach(async () => {
        mintable = await Mintable.new(initialSupply, { from: owner });
    });

    it('mints initial supply.', async () => {
        assert.equal(
            (await mintable.balanceOf(owner)).toNumber(),
            initialSupply,
        );
    });

    /**
     * Test minting.
     * @test {Mintable#mint}
     */
    it('does not allow minting to general public.', async () => {
        await expectRevert(
            mintable.mint(currencyToMint, { from: user1 }),
            'Ownable: caller is not the owner',
        );
    });

    it('mints tokens.', async () => {
        await mintable.mint(currencyToMint, { from: owner });
        assert.equal(
            (await mintable.balanceOf(owner)).toNumber(),
            initialSupply + currencyToMint,
        );
    });

    it('emits Minted events on minting.', async () => {
        expectEvent(
            await mintable.mint(currencyToMint, { from: owner }),
            'Minted',
            {
                amount: currencyToMint.toString(),
            },
        );
    });

    describe('With a positive token balance', () => {
        const currencyToBurn = 10000;

        beforeEach(async () => {
            await mintable.mint(currencyToMint, { from: owner });
        });

        it('burns tokens.', async () => {
            await mintable.burn(currencyToBurn, { from: owner });
            assert.equal(
                (await mintable.balanceOf(owner)).toNumber(),
                initialSupply + currencyToMint - currencyToBurn,
            );
        });

        it('emits Burnt events on burning.', async () => {
            expectEvent(
                await mintable.burn(currencyToBurn, { from: owner }),
                'Burnt',
                {
                    amount: currencyToBurn.toString(),
                },
            );
        });
    });
});
