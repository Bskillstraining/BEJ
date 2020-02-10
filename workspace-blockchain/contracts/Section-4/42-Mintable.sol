pragma solidity ^0.5.10;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "./41-Cryptocurrency.sol";


/// @dev A cryptocurrency with variable supply
contract Mintable is Cryptocurrency, Ownable {
    event Minted(uint256 amount);
    event Burnt(uint256 amount);

    /// @dev Initializes the cryptocurrency with an initial supply and a contract owner.
    constructor (uint256 initialSupply)
        Cryptocurrency(initialSupply)
        Ownable()
        public
    {}

    /// @dev Create more currency in the account of the owner.
    function mint(uint256 amount)
        public
        onlyOwner
    {
        balances[owner()] += amount;
        emit Minted(amount);
    }

    /// @dev Destroy currency from the account of the owner.
    function burn(uint256 amount)
        public
    {
        balances[msg.sender] -= amount;
        emit Burnt(amount);
    }
}