pragma solidity ^0.5.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


/**
 * @title MyERC20
 * @dev These contracts guide the user into building an ERC20 cryptocurrency.
 */
contract MyERC20 is ERC20 {
    constructor (uint256 totalSupply)
        public
    {
        _mint(msg.sender, totalSupply);
    }
}