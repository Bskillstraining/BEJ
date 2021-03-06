import { DocumentRegistryInstance } from '../../types/truffle-contracts';
// tslint:disable-next-line:no-var-requires
const { expectRevert, expectEvent } = require('@openzeppelin/test-helpers');

const DocumentRegistry = artifacts.require('DocumentRegistry') as Truffle.Contract<DocumentRegistryInstance>;

/** @test {DocumentRegistry} contract */
contract('DocumentRegistry', (accounts) => {

    let documentRegistry: DocumentRegistryInstance;

    const owner = accounts[0];
    const nonOwner = accounts[1];

    const hashToStore = 43;

    beforeEach(async () => {
        documentRegistry = await DocumentRegistry.new({ from: owner });
    });

    /**
     * Test the two contract methods
     * @test {DocumentRegistry#set} and {DocumentRegistry#get}
     */
    it('Store a hash and retrieve a block number.', async () => {
        await documentRegistry.set(hashToStore, { from: owner });
        const timestamp = await documentRegistry.get(hashToStore, { from: owner });

        assert.notEqual(timestamp.toNumber(), 0);
    });

    /**
     * Test block number of the transaction is associated to the hash
     * @test {DocumentRegistry#set} and {DocumentRegistry#get}
     */
    it('Retrieve the block number in which a hash was stored.', async () => {
        const transaction = await documentRegistry.set(hashToStore, { from: owner });
        const timestamp = await documentRegistry.get(hashToStore, { from: owner });

        assert.equal(timestamp.toNumber(), transaction.receipt.blockNumber);
    });

    /**
     * @test {DocumentRegistry#set}
     */
    it('Only owner can set', async () => {
        await expectRevert(
            documentRegistry.set(hashToStore, { from: nonOwner }),
            'Ownable: caller is not the owner',
        );
    });

    /**
     * Test event emission with expectEvent
     * @test {DocumentRegistry#set}
     */
    it('Store and retrieve a value - expectEvent.', async () => {
        expectEvent(
            await documentRegistry.set(hashToStore, { from: owner }),
            'EntryAdded',
            {
                hash: hashToStore.toString(),
            },
        );
    });
});
