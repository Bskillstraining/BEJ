pragma solidity ^0.5.10;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20Detailed.sol";
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

    function mint(address recipient, uint256 amount)
        public
        onlyOwner
    {
        _mint(owner, amount);
    }

    function burn(uint256 amount)
        public
        onlyOwner
    {
        _burn(owner, amount);
    }

    function transfer(address recipient, uint256 amount)
        public
    {
        feeToCharge = amount.mul(fee).div(10000);
        super.transfer(owner, feeToCharge);
        super.transfer(recipient, amount.sub(feeToCharge));
    }

    function transferFrom(address sender, address recipient, uint256 amount)
        public
    {
        revert;
    }
}