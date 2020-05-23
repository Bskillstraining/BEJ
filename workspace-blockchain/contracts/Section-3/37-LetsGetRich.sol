pragma solidity ^0.5.10;

import "./36-MyErc20Detailed.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";


/// @dev Adds a fee on transactions to MyErc20Detailed
contract LetsGetRich is MyErc20Detailed {
    using SafeMath for uint256;

    uint256 internal _fee = 1; // In basis points (0.01%)

    /// @dev Passes along the contructor parameters
    constructor (string memory name, string memory symbol, uint8 decimals)
        MyErc20Detailed(name, symbol, decimals)
        public
    {}

    /// @dev Split transfers, sending a percentage to the contract owner.
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