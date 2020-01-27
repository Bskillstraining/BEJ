pragma solidity ^0.5.10;

import "./../MyERC20.sol";


/**
 * @title MyERC20Mock
 * @dev These contracts guide the user into building an ERC20 cryptocurrency.
 */
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