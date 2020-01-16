import { should } from 'chai';
import { EventTableInstance } from '../../types/truffle-contracts';

const { expectRevert, expectEvent } = require('@openzeppelin/test-helpers');

const EventTable = artifacts.require('./Module-32/EventTable.sol') as Truffle.Contract<EventTableInstance>;
should();


/** @test {EventTable} contract */
contract('EventTable', (accounts) => {

    let eventTable: EventTableInstance;

    const owner = accounts[0];
    const nonOwner = accounts[1];

    const keyToStore = 42;
    const valueToStore = 43;

    beforeEach(async () => {
        eventTable = await EventTable.new({ from: owner });
    });

    /**
     * Test the two contract methods
     * @test {EventTable#set} and {EventTable#get}
     */
    it('Store and retrieve a value.', async () => {
        await eventTable.set(keyToStore, valueToStore, { from: owner });
        const storedValue = await eventTable.get(keyToStore, { from: owner });

        (storedValue.toNumber()).should.be.equal(valueToStore);
    });

    /**
     * @test {EventTable#set}
     */
    it('Only owner can set', async () => {
        await expectRevert(
            eventTable.set(keyToStore, valueToStore, { from: nonOwner }),
            'Ownable: caller is not the owner',
        );
    });

    /**
     * Test event emission
     * @test {EventTable#set}
     */
    it('Store and retrieve a value - event emission.', async () => {
        const transaction = await eventTable.set(keyToStore, valueToStore, { from: owner });
        const firstEvent = transaction.logs[0];
        const eventName = firstEvent.event;
        const eventKey = firstEvent.args.key;
        const eventValue = firstEvent.args.value;

        eventName.should.be.equal('ValueAdded');
        eventKey.toNumber().should.be.equal(keyToStore);
        eventValue.toNumber().should.be.equal(valueToStore);
    });

    /**
     * Test event emission with expectEvent
     * @test {EventTable#set}
     */
    it('Store and retrieve a value - expectEvent.', async () => {
        expectEvent(
            await eventTable.set(keyToStore, valueToStore, { from: owner }),
            'ValueAdded',
            {
                key: keyToStore.toString(),
                value: valueToStore.toString(),
            },
        );
    });
});
