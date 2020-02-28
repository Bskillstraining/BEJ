import * as chai from 'chai';
import { IssuanceInstance, MyERC20Instance } from '../../types/truffle-contracts';
const Issuance = artifacts.require('Issuance') as Truffle.Contract<IssuanceInstance>;
const MyERC20 = artifacts.require('MyERC20') as Truffle.Contract<MyERC20Instance>;

// tslint:disable-next-line:no-var-requires
const { expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

contract('Issuance', (accounts) => {

    let issuance: IssuanceInstance;
    let currency: MyERC20Instance;

    const owner = accounts[0];
    const investor = accounts[1];
    const supply = '1000';
    const investorBalance = '100';
    const price = '10';
    const investment = '10';
    const tokensBought = '1';

    beforeEach(async () => {
        currency = await MyERC20.new(supply);
        issuance = await Issuance.new(price, currency.address);
        currency.transfer(investor, investorBalance, { from: owner });
        await currency.approve(issuance.address, investment, { from: investor });
    });

    it('cannot claim if not live', async () => {
        await expectRevert(
            issuance.claim({ from: investor }),
            'Cannot claim until live.',
        );
    });

    it('cannot withdraw if not live', async () => {
        await expectRevert(
            issuance.withdraw({ from: owner }),
            'Cannot withdraw until live.',
        );
    });

    it('cannot invest a fraction of the price', async () => {
        await expectRevert(
            issuance.invest(1, { from: investor }),
            'Cannot invest a fraction of the price.',
        );
    });

    it('can invest', async () => {
        expectEvent(
            await issuance.invest(investment, { from: investor }),
            'Invested',
            {
                investment: investment,
                investor: investor,
            },
        );
    });

    describe('after investing', () => {
        beforeEach(async () => {
            await issuance.invest(investment, { from: investor });
        });

        it('can cancel investment', async () => {
            expectEvent(
                await issuance.cancel({ from: investor }),
                'Cancelled',
                {
                    investor: investor,
                },
            );
        });
    });

    it('can go live', async () => {
        expectEvent(
            await issuance.goLive({ from: owner }),
            'GoneLive',
            {},
        );
    });

    describe('after going live', () => {
        beforeEach(async () => {
            await issuance.goLive({ from: owner });
        });

        it('cannot invest if live', async () => {
            await expectRevert(
                issuance.invest(investment, { from: investor }),
                'Cannot invest if live.',
            );
        });

        it('cannot cancel investment if live', async () => {
            await expectRevert(
                issuance.cancel({ from: investor }),
                'Cannot cancel if live.',
            );
        });
    });

    describe('after going live and having investments', () => {
        beforeEach(async () => {
            await issuance.invest(investment, { from: investor });
            await issuance.goLive({ from: owner });
        });

        it('can claim', async () => {
            expectEvent(
                await issuance.claim({ from: investor }),
                'Claimed',
                {
                    investor: investor,
                    tokens: tokensBought,
                },
            );
        });
        it('can withdraw', async () => {
            expectEvent(
                await issuance.withdraw({ from: owner }),
                'Withdrawn',
                {
                    proceedings: investment,
                },
            );
        });
    });
});