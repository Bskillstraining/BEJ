import { BigNumber } from 'bignumber.js';
import { MintableInstance } from '../../types/truffle-contracts';
import { SafeMintableInstance } from '../../types/truffle-contracts';
// tslint:disable-next-line:no-var-requires
const { expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

const Mintable = artifacts.require('Mintable') as Truffle.Contract<MintableInstance>;
const SafeMintable = artifacts.require('SafeMintable') as Truffle.Contract<SafeMintableInstance>;

/** @test {Mintable} contract */
contract('Mintable', (accounts) => {

    let mintable: MintableInstance;

    const owner = accounts[0];
    const user1 = accounts[1];
    const initialSupply = 0;

    beforeEach(async () => {
        mintable = await Mintable.new(initialSupply, { from: owner });
    });

    it('can be exploited for free tokens.', async () => {
        const oneToken = 1;
        await mintable.burn(oneToken, { from: user1 });
        // user1 has a balance of zero. If he burns tokens he shouldn't have a positive balance afterwards.
        // The test here is that Mintable CAN be exploted.
        // The balance after this exploit is 2**256-1 and chai doesn't work with BigNumbers, so we use `assert`
        assert.isTrue(new BigNumber(await mintable.balanceOf(user1)).gt('0'));
    });
});

/** @test {SafeMintable} contract */
contract('SafeMintable', (accounts) => {

    let safeMintable: SafeMintableInstance;

    const owner = accounts[0];
    const user1 = accounts[1];
    const oneToken = 1;
    const currencyToMint = 1000000;

    beforeEach(async () => {
        safeMintable = await SafeMintable.new({ from: owner });
    });

    it('initializes', async () => {
        assert.equal(
            (await safeMintable.balanceOf(owner)).toNumber(),
            0,
        );
    });

    /**
     * Test minting.
     * @test {Mintable#mint}
     */
    it('does not allow minting to general public.', async () => {
        await expectRevert(
            safeMintable.mint(oneToken, { from: user1 }),
            'Ownable: caller is not the owner',
        );
    });

    it('does not allow burning not existing tokens.', async () => {
        await expectRevert(
            safeMintable.burn(oneToken, { from: user1 }),
            'SafeMath: subtraction overflow',
        );
    });

    it('does not allow transferring not existing tokens.', async () => {
        await expectRevert(
            safeMintable.transfer(owner, oneToken, { from: user1 }),
            'SafeMath: subtraction overflow',
        );
    });

    it('mints tokens.', async () => {
        await safeMintable.mint(currencyToMint, { from: owner });

        assert.equal(
            (await safeMintable.balanceOf(owner)).toNumber(),
            currencyToMint,
        );
    });

    it('emits Minted events on minting.', async () => {
        expectEvent(
            await safeMintable.mint(oneToken, { from: owner }),
            'Minted',
            {
                amount: oneToken.toString(),
            },
        );
    });

    describe('With a positive token balance', () => {
        const currencyToBurn = currencyToMint - 1;
        const currencyToTransfer = currencyToMint - 1;

        beforeEach(async () => {
            await safeMintable.mint(currencyToMint, { from: owner });
        });

        it('burns some tokens.', async () => {
            await safeMintable.burn(currencyToBurn, { from: owner });
            assert.equal(
                (await safeMintable.balanceOf(owner)).toNumber(),
                currencyToMint - currencyToBurn,
            );
        });

        it('burns all tokens.', async () => {
            await safeMintable.burn(currencyToMint, { from: owner });
            assert.equal(
                (await safeMintable.balanceOf(owner)).toNumber(),
                0
            );
        });

        it('emits Burnt events on burning.', async () => {
            expectEvent(
                await safeMintable.burn(oneToken, { from: owner }),
                'Burnt',
                {
                    amount: oneToken.toString(),
                },
            );
        });

        it('transfers some tokens.', async () => {
            await safeMintable.transfer(user1, currencyToTransfer, { from: owner });

            assert.equal(
                (await safeMintable.balanceOf(owner)).toNumber(),
                currencyToMint - currencyToTransfer,
            );
            assert.equal(
                (await safeMintable.balanceOf(user1)).toNumber(),
                currencyToTransfer,
            );
        });

        it('transfers all tokens.', async () => {
            safeMintable.transfer(user1, currencyToMint, { from: owner });

            assert.equal(
                (await safeMintable.balanceOf(owner)).toNumber(),
                0,
            );
            assert.equal(
                (await safeMintable.balanceOf(user1)).toNumber(),
                currencyToMint,
            );
        });

        it('emits Transferred events on transferring.', async () => {
            expectEvent(
                await safeMintable.transfer(user1, oneToken, { from: owner }),
                'Transferred',
                {
                    amount: oneToken.toString(),
                    recipient: user1,
                },
            );
        });
    });
});
