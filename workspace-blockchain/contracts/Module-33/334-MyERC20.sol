pragma solidity ^0.5.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


/// @dev A minimal ERC20 cryptocurrency
contract MyERC20 is ERC20 {

    /// @dev Initialize the currency with a fixed supply
    constructor (uint256 totalSupply)
        public
    {
        _mint(msg.sender, totalSupply);
    }
}