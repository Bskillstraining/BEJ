pragma solidity ^0.5.10;

import "./336-MyERC20Detailed.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";


/**
 * @title LetsGetRich
 * @dev These contracts guide the user into building an ERC20 cryptocurrency.
 */
contract LetsGetRich is MyERC20Detailed {
    using SafeMath for uint256;

    uint256 private _fee = 1; // In basis points (0.01%)

    constructor (string memory name, string memory symbol, uint8 decimals)
        MyERC20Detailed(name, symbol, decimals)
        public
    {}

    function transfer(address recipient, uint256 amount)
        public
        returns(bool)
    {
        uint256 feeToCharge = amount.mul(_fee).div(10000);
        super.transfer(owner(), feeToCharge);
        super.transfer(recipient, amount.sub(feeToCharge));
        return true;
    }
}