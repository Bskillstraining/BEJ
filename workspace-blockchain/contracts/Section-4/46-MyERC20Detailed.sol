pragma solidity ^0.5.10;

import "./45-MyERC20Mintable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";


/// @dev Add name, symbol and decimals to MyERC20Mintable
contract MyERC20Detailed is MyERC20Mintable, ERC20Detailed {

    /// @dev Initialize ERC20 details
    constructor (string memory name, string memory symbol, uint8 decimals)
        MyERC20Mintable()
        ERC20Detailed(name, symbol, decimals)
        public
    {}
}