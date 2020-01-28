pragma solidity ^0.5.10;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


/**
 * @title MyERC20
 * @dev These contracts guide the user into building an ERC20 cryptocurrency.
 */
contract MyERC20Mintable is ERC20, Ownable {

    constructor () // Verify this is needed
        Ownable()
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