
import { MyErc20DetailedInstance } from '../../types/truffle-contracts';

const MyErc20Detailed = artifacts.require('MyErc20Detailed') as Truffle.Contract<MyErc20DetailedInstance>;

/** @test {MyErc20Detailed} contract */
contract('MyErc20Detailed', (accounts) => {

    let myERC20: MyErc20DetailedInstance;

    const owner = accounts[0];
    const name = 'BeyondSkills Token';
    const symbol = 'BST';
    const decimals = 18;

    beforeEach(async () => {
        myERC20 = await MyErc20Detailed.new(name, symbol, decimals, { from: owner });
    });

    /**
     * Test the token details
     * @test {MyErc20Detailed#name}, {MyErc20Detailed#symbol} and {MyErc20Detailed#decimals}
     */
    it('Retrieve token details.', async () => {
        assert.equal(
            await myERC20.name(),
            name,
        );
        assert.equal(
            await myERC20.symbol(),
            symbol,
        );
        assert.equal(
            (await myERC20.decimals()).toNumber(),
            decimals,
        );
    });
});
