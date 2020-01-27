pragma solidity ^0.5.10;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";


/**
 * @title LetsGetRich
 * @dev These contracts guide the user into building an ERC20 cryptocurrency.
 */
contract LetsGetRich is ERC20, ERC20Detailed, Ownable {
    using SafeMath for uint256;

    uint256 private _fee; // In basis points (0.01%)

    constructor (string memory name, string memory symbol, uint8 decimals, uint256 fee)
        Ownable()
        ERC20Detailed(name, symbol, decimals)
        public
    {
        _fee = fee;
    }

    function mint(address, uint256 amount)
        public
        onlyOwner
    {
        _mint(owner(), amount);
    }

    function burn(uint256 amount)
        public
        onlyOwner
    {
        _burn(owner(), amount);
    }

    function transfer(address recipient, uint256 amount)
        public
        returns(bool)
    {
        uint256 feeToCharge = amount.mul(_fee).div(10000);
        super.transfer(owner(), feeToCharge);
        super.transfer(recipient, amount.sub(feeToCharge));
        return true;
    }

    function transferFrom(address, address, uint256)
        public
        returns(bool)
    {
        revert("transferFrom disabled.");
    }
}