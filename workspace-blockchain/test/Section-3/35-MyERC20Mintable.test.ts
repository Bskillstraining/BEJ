import { MyERC20MintableInstance } from '../../types/truffle-contracts';
// tslint:disable-next-line:no-var-requires
const { expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

const MyERC20Mintable = artifacts.require('MyERC20Mintable') as Truffle.Contract<MyERC20MintableInstance>;

/** @test {SafeMintable} contract */
contract('SafeMintable', (accounts) => {

    let myERC20Mintable: MyERC20MintableInstance;

    const owner = accounts[0];
    const user1 = accounts[1];
    const zeroAddress = '0x0000000000000000000000000000000000000000';
    const oneToken = 1;
    const currencyToMint = 1000000;

    beforeEach(async () => {
        myERC20Mintable = await MyERC20Mintable.new({ from: owner });
    });

    it('mints initial supply.', async () => {
        assert.equal(
            (await myERC20Mintable.balanceOf(owner)).toNumber(),
            0,
        );
    });

    /**
     * Test minting.
     * @test {Mintable#mint}
     */
    it('does not allow minting to general public.', async () => {
        await expectRevert(
            myERC20Mintable.mint(user1, oneToken, { from: user1 }),
            'Ownable: caller is not the owner',
        );
    });

    it('does not allow burning not existing tokens.', async () => {
        await expectRevert(
            myERC20Mintable.burn(oneToken, { from: user1 }),
            'ERC20: burn amount exceeds balance',
        );
    });

    it('mints tokens.', async () => {
        await myERC20Mintable.mint(owner, currencyToMint, { from: owner });

        assert.equal(
            (await myERC20Mintable.balanceOf(owner)).toNumber(),
            currencyToMint,
        );
    });

    it('emits Transfer events on minting.', async () => {
        expectEvent(
            await myERC20Mintable.mint(owner, oneToken, { from: owner }),
            'Transfer',
            {
                from: zeroAddress,
                to: owner,
                value: oneToken.toString(),
            },
        );
    });

    describe('With a positive token balance', () => {
        const currencyToBurn = currencyToMint - 1;

        beforeEach(async () => {
            await myERC20Mintable.mint(owner, currencyToMint, { from: owner });
        });

        it('burns some tokens.', async () => {
            await myERC20Mintable.burn(currencyToBurn, { from: owner });
            assert.equal(
                (await myERC20Mintable.balanceOf(owner)).toNumber(),
                currencyToMint - currencyToBurn,
            );
        });

        it('burns all tokens.', async () => {
            await myERC20Mintable.burn(currencyToMint, { from: owner });
            assert.equal(
                (await myERC20Mintable.balanceOf(owner)).toNumber(),
                0,
            );
        });

        it('emits Transfer events on burning.', async () => {
            expectEvent(
                await myERC20Mintable.burn(oneToken, { from: owner }),
                'Transfer',
                {
                    from: owner,
                    to: zeroAddress,
                    value: oneToken.toString(),
                },
            );
        });
    });
});
