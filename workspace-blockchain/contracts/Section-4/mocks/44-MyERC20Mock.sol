pragma solidity ^0.5.10;

import "./../44-MyERC20.sol";


contract MyERC20Mock is MyERC20 {

    function mint(address recipient, uint256 amount)
        public
    {
        _mint(recipient, amount);
    }

    function burn(uint256 amount)
        public
    {
        _burn(msg.sender, amount);
    }
}