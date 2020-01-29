import { should } from 'chai';
import { MintableInstance } from '../../types/truffle-contracts';

const { expectRevert } = require('@openzeppelin/test-helpers');

const Mintable = artifacts.require('Mintable') as Truffle.Contract<MintableInstance>;

should();

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

    /**
     * Test minting.
     * @test {Mintable#mint}
     */
    it('Minting not allowed to general public.', async () => {
        await expectRevert(
            mintable.mint(currencyToMint, { from: user1 }),
            'Ownable: caller is not the owner',
        );
    });

    it('Burning tokens.', async () => {
        const amountBurned = 10000;
        await mintable.mint(currencyToMint, { from: owner });

        await mintable.burn(amountBurned, { from: owner });

        (await mintable.balanceOf(owner)).toNumber().should.be.equal(currencyToMint - amountBurned);
    });
});
