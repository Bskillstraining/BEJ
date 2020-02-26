import { EthVaultInstance } from '../../types/truffle-contracts';

const { BN, ether, expectRevert } = require('@openzeppelin/test-helpers');

const EthVault = artifacts.require('EthVault') as Truffle.Contract<EthVaultInstance>;

/** @test {EthVault} contract */
contract('EthVault', (accounts) => {

    let holdings: EthVaultInstance;

    const user1 = accounts[1];
    const user2 = accounts[2];
    const etherToStore = ether('1');
    // const gasPrice = 1;
    let userSupply : any;

    beforeEach(async () => {
        holdings = await EthVault.new();
    });

    it('stores ether.', async () => {
        // const userBalanceBefore = await web3.eth.getBalance(user1);
        const contractBalanceBefore = await web3.eth.getBalance(holdings.address);
        
        const tx = await holdings.store({ from: user1, value: etherToStore.toString()/*, gasPrice: gasPrice*/ });
        // const gasPrice = (await web3.eth.getTransaction(tx.tx)).gasPrice;
        // const txCost = tx.receipt.gasUsed * gasPrice;
        // const userBalanceAfter = await web3.eth.getBalance(user1);
        const contractBalanceAfter = await web3.eth.getBalance(holdings.address);

        /// console.log('Gas price ' + gasPrice);

        // assert.equal(Number(userBalanceBefore), Number(userBalanceAfter) + Number(etherToStore) + Number(txCost));
        assert.equal(Number(contractBalanceBefore) + Number(etherToStore), Number(contractBalanceAfter));
    });

    describe('holding ether', () => {
        beforeEach(async () => {
            await holdings.store({ from: user1, value: etherToStore.toString() });
        });

        it('releases ether.', async () => {
            assert.equal(
                await web3.eth.getBalance(holdings.address),
                etherToStore,
            );
            await holdings.release(user2, { from: user1 });
            assert.equal(
                await web3.eth.getBalance(holdings.address),
                0,
            );
            // const userBalance = web3.eth.getBalance(user2);
            // assert.equal(userBalance, userSupply + etherToStore);
        });
    });
});
