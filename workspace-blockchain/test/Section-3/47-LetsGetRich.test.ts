import { BigNumber } from 'bignumber.js';
import { MyErc20DetailedInstance } from '../../types/truffle-contracts';

const LetsGetRich = artifacts.require('LetsGetRich') as Truffle.Contract<MyErc20DetailedInstance>;

/** @test {MyErc20Detailed} contract */
contract('MyErc20Detailed', (accounts) => {

    let myERC20: MyErc20DetailedInstance;

    const owner = accounts[0];
    const user1 = accounts[1];
    const user2 = accounts[2];
    const name = 'BeyondSkills Token';
    const symbol = 'BST';
    const decimals = 18;
    const initialSupply = new BigNumber(10 ** 21); // 1000 tokens

    beforeEach(async () => {
        myERC20 = await LetsGetRich.new(name, symbol, decimals, { from: owner });
        await myERC20.mint(user1, new BigNumber(initialSupply).toString(10), { from: owner });
    });

    /**
     * Test the token details
     * @test {MyErc20Detailed#name}, {MyErc20Detailed#symbol} and {MyErc20Detailed#decimals}
     */
    it('transfers tokens and derives the fee.', async () => {
        const tokensToTransfer = new BigNumber(10 ** 20);
        const transactionFee = new BigNumber((10 ** 20) / 10000);

        await myERC20.transfer(user2, tokensToTransfer.toString(), { from: user1 });

        const user1Balance = initialSupply.minus(tokensToTransfer);
        assert.isTrue(
            (new BigNumber(await myERC20.balanceOf(user1))).eq(user1Balance),
        );

        const ownerBalance = transactionFee;
        assert.isTrue(
            (new BigNumber(await myERC20.balanceOf(owner))).eq(ownerBalance),
        );

        const user2Balance = tokensToTransfer.minus(transactionFee);
        assert.isTrue(
            (new BigNumber(await myERC20.balanceOf(user2))).eq(user2Balance),
        );
    });
});
