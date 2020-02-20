import { HoldingsEthInstance } from '../../types/truffle-contracts';

const { BN, ether, expectRevert } = require('@openzeppelin/test-helpers');

const HoldingsEth = artifacts.require('HoldingsEth') as Truffle.Contract<HoldingsEthInstance>;

/** @test {Holdings} contract */
contract('HoldingsEth', (accounts) => {

    let holdings: HoldingsEthInstance;

    const user1 = accounts[1];
    const user2 = accounts[2];
    const etherToStore = ether('1');
    let userSupply : any;

    beforeEach(async () => {
        holdings = await HoldingsEth.new();
    });

    /* it('does not allow releasing if not stored.', async () => {
        
        await expectRevert(
            holdings.release(user2, { from: user1 }),
            'Not holding.',
        );
    }); */

    it('stores ether.', async () => {
        const userBalanceBefore = await web3.eth.getBalance(user1);
        const contractBalanceBefore = await web3.eth.getBalance(holdings.address);
        
        const tx = await holdings.store({ from: user1, value: etherToStore.toString() });

        const userBalanceAfter = await web3.eth.getBalance(user1);
        const contractBalanceAfter = await web3.eth.getBalance(holdings.address);

        console.log('Before ' + userBalanceBefore);
        console.log('Stored ' + etherToStore);
        console.log('Gas used ' + tx.receipt.gasUsed);
        console.log('After ' + userBalanceAfter);

        assert.equal(Number(userBalanceBefore), Number(userBalanceAfter) + Number(etherToStore) + Number(tx.receipt.gasUsed));
        // assert.equal(contractBalanceBefore + etherToStore, contractBalanceAfter);
    });

    /* describe('holding currency', () => {
        beforeEach(async () => {
            await holdings.store({ from: user1, value: etherToStore.toString() });
        });
        
        it('does not allow storing if already holding.', async () => {
            await expectRevert(
                await holdings.store({ from: user1, value: etherToStore.toString() }),
                'Already holding.',
            );
        });

        it('releases currency.', async () => {
            await holdings.release(user2, { from: user1 });

            const userBalance = web3.eth.getBalance(user2);
            const contractBalance = web3.eth.getBalance(holdings.address);
            assert.equal(userBalance, userSupply + etherToStore);
            assert.equal(contractBalance, 0);
        });
    }); */
});
