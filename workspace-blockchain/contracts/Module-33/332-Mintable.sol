pragma solidity ^0.5.10;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "./331-Cryptocurrency.sol";


/**
 * @title Mintable
 * @dev These contracts guide the user into building an ERC20 cryptocurrency.
 */
contract Mintable is Cryptocurrency, Ownable {
    event Minted(uint256 amount);
    event Burnt(uint256 amount);

    constructor (uint256 initialSupply)
        Cryptocurrency(initialSupply)
        Ownable()
        public
    {}

    function mint(uint256 amount)
        public
        onlyOwner
    {
        balances[owner()] += amount;
        emit Minted(amount);
    }

    function burn(uint256 amount)
        public
    {
        balances[msg.sender] -= amount;
        emit Burnt(amount);
    }
}