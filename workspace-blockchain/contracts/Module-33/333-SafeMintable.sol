pragma solidity ^0.5.10;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./331-Cryptocurrency.sol";

/**
 * @title Mintable
 * @dev These contracts guide the user into building an ERC20 cryptocurrency.
 */
contract Mintable is Cryptocurrency, Ownable {
    using SafeMath for uint256;

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
        balances[owner()] = balances[owner()].add(amount);
        emit Minted(amount);
    }

    function burn(uint256 amount)
        public
    {
        balances[owner()] = balances[owner()].sub(amount);
        emit Burned(amount);
    }
}