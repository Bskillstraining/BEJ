pragma solidity ^0.5.10;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";


/**
 * @title MyERC20Detailed
 * @dev These contracts guide the user into building an ERC20 cryptocurrency.
 */
contract MyERC20Detailed is ERC20, ERC20Detailed, Ownable {

    constructor (string memory name, string memory symbol, uint8 decimals)
        Ownable()
        ERC20Detailed(name, symbol, decimals)
        public
    {}

    function mint(address recipient, uint256 amount)
        public
        onlyOwner
    {
        _mint(recipient, amount);
    }

    function burn(uint256 amount)
        public
    {
        _burn(msg.sender, amount);
    }
}