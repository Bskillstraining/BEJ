import { MyERC20MockInstance } from '../../types/truffle-contracts';
// tslint:disable-next-line:no-var-requires
const { expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

const MyERC20 = artifacts.require('MyERC20') as Truffle.Contract<MyERC20MockInstance>;

/** @test {MyERC20} contract */
contract('MyERC20', (accounts) => {

    let myERC20: MyERC20MockInstance;

    const owner = accounts[0];
    const user1 = accounts[1];
    const oneToken = 1;
    const initialSupply = 1000000;

    beforeEach(async () => {
        myERC20 = await MyERC20.new(initialSupply, { from: owner });
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
