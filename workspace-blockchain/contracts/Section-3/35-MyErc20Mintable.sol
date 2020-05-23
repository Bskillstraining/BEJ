pragma solidity ^0.5.10;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


/// @dev An ERC20 cryptocurrency with variable supply
contract MyErc20Mintable is ERC20, Ownable {

    /// @dev Initializes the cryptocurrency with a contract owner.
    constructor ()
        Ownable()
        public
    {}

    /// @dev Create more currency in the account of the owner.
    function mint(address recipient, uint256 amount)
        public
        onlyOwner
    {
        _mint(recipient, amount);
    }

    /// @dev Destroy currency from the account of the owner.
    function burn(uint256 amount)
        public
    {
        _burn(msg.sender, amount);
    }
}