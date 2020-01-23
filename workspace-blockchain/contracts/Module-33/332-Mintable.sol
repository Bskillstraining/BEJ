pragma solidity ^0.5.10;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "./331-Cryptocurrency.sol";

/**
 * @title Mintable
 * @dev These contracts guide the user into building an ERC20 cryptocurrency.
 */
contract Mintable is Cryptocurrency, Ownable {
    event Minted(uint256 amount);
    event Burned(uint256 amount);

    constructor ()
        Cryptocurrency(0)
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
        emit Burned(amount);
    }
}