pragma solidity ^0.5.10;

import "./../34-MyErc20.sol";


contract MyErc20Mock is MyErc20 {

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