pragma solidity ^0.5.10;

import "./35-MyErc20Mintable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";


/// @dev Add name, symbol and decimals to MyErc20Mintable
contract MyErc20Detailed is MyErc20Mintable, ERC20Detailed {

    /// @dev Initialize ERC20 details
    constructor (string memory name, string memory symbol, uint8 decimals)
        MyErc20Mintable()
        ERC20Detailed(name, symbol, decimals)
        public
    {}
}