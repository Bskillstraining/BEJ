
import { MyERC20DetailedInstance } from '../../types/truffle-contracts';

const { expectRevert } = require('@openzeppelin/test-helpers');

const MyERC20Detailed = artifacts.require('MyERC20Detailed') as Truffle.Contract<MyERC20DetailedInstance>;

;

/** @test {MyERC20Detailed} contract */
contract('MyERC20Detailed', (accounts) => {

    let myERC20: MyERC20DetailedInstance;

    const owner = accounts[0];
    const name = 'BeyondSkills Token';
    const symbol = 'BST';
    const decimals = 18;

    beforeEach(async () => {
        myERC20 = await MyERC20Detailed.new(name, symbol, decimals, { from: owner });
    });

    /**
     * Test the token details
     * @test {MyERC20Detailed#name}, {MyERC20Detailed#symbol} and {MyERC20Detailed#decimals}
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
