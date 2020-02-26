import { HoldingsEthInstance } from '../../types/truffle-contracts';

const { BN, ether, expectRevert } = require('@openzeppelin/test-helpers');

const HoldingsEth = artifacts.require('HoldingsEth') as Truffle.Contract<HoldingsEthInstance>;

/** @test {Holdings} contract */
contract('HoldingsEth', (accounts) => {

    let holdings: HoldingsEthInstance;

    const user1 = accounts[1];
    const user2 = accounts[2];
    const etherToStore = ether('1');
    // const gasPrice = 1;
    let userSupply : any;

    beforeEach(async () => {
        holdings = await HoldingsEth.new();
    });

    it('does not allow releasing if not stored.', async () => {
        
        await expectRevert(
            holdings.release(user2, { from: user1 }),
            'Not holding.',
        );
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
        
        it('does not allow storing if already holding.', async () => {
            await expectRevert(
                holdings.store({ from: user1, value: etherToStore.toString() }),
                'Already holding.',
            );
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
