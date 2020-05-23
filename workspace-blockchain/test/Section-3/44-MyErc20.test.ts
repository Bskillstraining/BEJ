import { MyErc20MockInstance } from '../../types/truffle-contracts';

const { expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

const MyErc20 = artifacts.require('MyErc20') as Truffle.Contract<MyErc20MockInstance>;

/** @test {MyErc20} contract */
contract('MyErc20', (accounts) => {

    let myERC20: MyErc20MockInstance;

    const owner = accounts[0];
    const user1 = accounts[1];
    const oneToken = 1;
    const initialSupply = 1000000;

    beforeEach(async () => {
        myERC20 = await MyErc20.new(initialSupply, { from: owner });
    });

    it('mints initial supply.', async () => {
        assert.equal(
            (await myERC20.balanceOf(owner)).toNumber(),
            initialSupply,
        );
    });

    it('does not allow transferring not existing tokens.', async () => {
        await expectRevert(
            myERC20.transfer(owner, oneToken, { from: user1 }),
            'ERC20: transfer amount exceeds balance',
        );
    });

    it('transfers some tokens.', async () => {
        await myERC20.transfer(user1, oneToken, { from: owner });

        assert.equal(
            (await myERC20.balanceOf(owner)).toNumber(),
            initialSupply - oneToken,
        );
        assert.equal(
            (await myERC20.balanceOf(user1)).toNumber(),
            oneToken,
        );
    });

    it('transfers all tokens.', async () => {
        myERC20.transfer(user1, initialSupply, { from: owner });

        assert.equal(
            (await myERC20.balanceOf(owner)).toNumber(),
            0,
        );
        assert.equal(
            (await myERC20.balanceOf(user1)).toNumber(),
            initialSupply,
        );
    });

    it('emits Transfer events on transferring.', async () => {
        expectEvent(
            await myERC20.transfer(user1, oneToken, { from: owner }),
            'Transfer',
            {
                from: owner,
                to: user1,
                value: oneToken.toString(),
            },
        );
    });
});
