pragma solidity ^0.5.10;

import "./335-MyERC20Mintable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";


/**
 * @title MyERC20Detailed
 * @dev These contracts guide the user into building an ERC20 cryptocurrency.
 */
contract MyERC20Detailed is MyERC20Mintable, ERC20Detailed {

    constructor (string memory name, string memory symbol, uint8 decimals)
        MyERC20Mintable()
        ERC20Detailed(name, symbol, decimals)
        public
    {}
}