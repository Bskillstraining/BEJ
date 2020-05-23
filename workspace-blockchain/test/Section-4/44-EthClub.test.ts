import { EthClubInstance } from '../../types/truffle-contracts';
// tslint:disable-next-line:no-var-requires
const { ether, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

const EthClub = artifacts.require('EthClub') as Truffle.Contract<EthClubInstance>;

/** @test {EthClub} contract */
contract('EthClub', (accounts) => {

    let club: EthClubInstance;

    const owner = accounts[0];
    const member = accounts[1];
    const membershipFee = ether('0.1');

    beforeEach(async () => {
        club = await EthClub.new(membershipFee, { from: owner });
    });

    it('requires the membership fee for registering', async () => {
        await expectRevert(
            club.register({ from: member }),
            'Please pay the exact fee.',
        );
    });

    it('registers a member', async () => {
        expectEvent(
            await club.register({ from: member, value: membershipFee}),
            'MemberAdded',
            {
                member: { member },
            }
        );
    });

    it('registers membership time', async () => {
        const tx = await club.register({ from: member, value: membershipFee});
        const time = (await web3.eth.getTransaction(tx.tx)).blockNumber;
        assert.equal((await club.get(member)), time);
    });

    describe('after members register', () => {
        beforeEach(async () => {
            await club.register({ from: member, value: membershipFee});
        });

        it('shows memberships', async () => {
            assert.equal((await club.get(owner)).toString(), '0');
            assert.notEqual((await club.get(member)).toString(), '0');
        });

        it('allows owner to withdraw funds', async () => {
            await club.withdraw({ from: owner });
            // Not sure how to check that the owner balance increased without using chai
        });
    });
});
