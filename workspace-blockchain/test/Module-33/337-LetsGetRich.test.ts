import { BigNumber } from 'bignumber.js';
import { MyERC20DetailedInstance } from '../../types/truffle-contracts';

const LetsGetRich = artifacts.require('LetsGetRich') as Truffle.Contract<MyERC20DetailedInstance>;

/** @test {MyERC20Detailed} contract */
contract('MyERC20Detailed', (accounts) => {

    let myERC20: MyERC20DetailedInstance;

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
     * @test {MyERC20Detailed#name}, {MyERC20Detailed#symbol} and {MyERC20Detailed#decimals}
     */
    it('transfers tokens and derives the fee.', async () => {
        const tokensToTransfer = new BigNumber(10 ** 20);
        const transactionFee = new BigNumber((10 ** 20) / 10000);

        await myERC20.transfer(user2, tokensToTransfer.toString(), { from: user1 });

        const user1Balance = initialSupply.minus(tokensToTransfer);
        assert.equal(
            (await myERC20.balanceOf(user1)).toString(),
            user1Balance.toString(),
        );

        const ownerBalance = transactionFee;
        assert.equal(
            (await myERC20.balanceOf(owner)).toString(),
            ownerBalance.toString(),
        );

        const user2Balance = tokensToTransfer.minus(transactionFee);
        assert.equal(
            (await myERC20.balanceOf(user2)).toString(),
            user2Balance.toString(),
        );
    });
});
