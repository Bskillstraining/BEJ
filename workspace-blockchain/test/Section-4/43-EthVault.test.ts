import { EthVaultInstance } from '../../types/truffle-contracts';
// tslint:disable-next-line:no-var-requires
const { ether } = require('@openzeppelin/test-helpers');

const EthVault = artifacts.require('EthVault') as Truffle.Contract<EthVaultInstance>;

/** @test {EthVault} contract */
contract('EthVault', (accounts) => {

    let vault: EthVaultInstance;

    const user1 = accounts[1];
    const user2 = accounts[2];
    const etherToStore = ether('1');

    beforeEach(async () => {
        vault = await EthVault.new();
    });

    it('deposits ether.', async () => {
        const contractBalanceBefore = await web3.eth.getBalance(vault.address);
        await vault.deposit({ from: user1, value: etherToStore.toString()/*, gasPrice: gasPrice*/ });
        const contractBalanceAfter = await web3.eth.getBalance(vault.address);

        assert.equal(Number(contractBalanceBefore) + Number(etherToStore), Number(contractBalanceAfter));
    });

    describe('holding ether', () => {
        beforeEach(async () => {
            await vault.deposit({ from: user1, value: etherToStore.toString() });
        });

        it('releases ether.', async () => {
            assert.equal(
                await web3.eth.getBalance(vault.address),
                etherToStore,
            );
            await vault.release(user2, { from: user1 });
            assert.equal(
                await web3.eth.getBalance(vault.address),
                0,
            );
        });
    });
});
