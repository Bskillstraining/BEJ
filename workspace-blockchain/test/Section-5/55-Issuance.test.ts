import * as chai from 'chai';
// tslint:disable-next-line:no-var-requires
const { balance, BN, ether, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
import { MyERC20Instance, IssuanceInstance } from '../../types/truffle-contracts';

const Issuance = artifacts.require('Issuance') as Truffle.Contract<IssuanceInstance>;
const MyERC20 = artifacts.require('MyERC20') as Truffle.Contract<MyERC20Instance>;

// tslint:disable-next-line:no-var-requires
// chai.use(require('chai-bn')(require('bn.js')));
// chai.should();

contract('Issuance', (accounts) => {

    let issuance: IssuanceInstance;
    let currency: MyERC20Instance;

    const owner = accounts[0];
    const investor = accounts[1];
    const supply = ether('1000');
    const investorBalance = ether('100')
    const price = ether('10');

    beforeEach(async () => {
        currency = await MyERC20.new(supply);
        issuance = await Issuance.new(price, currency.address);
        currency.transfer(investor, investorBalance, { from: owner});
    });

    it('cannot claim if not live', async () => {});
    it('cannot withdraw if not live', async () => {});
    it('cannot invest a fraction of the price', async () => {});
    it('can invest', async () => {});
    describe('after investing', () => {
        it('can cancel investment', async () => {});
    });
    it('can go live', async () => {});
    describe('after going live', () => {
        it('cannot invest if live', async () => {});
        it('cannot cancel investment if live', async () => {});
        describe('after going live and having investments', () => {
            it('can claim', async () => {});
            it('can withdraw', async () => {});
        });
    });
});