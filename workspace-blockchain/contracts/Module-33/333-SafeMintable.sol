pragma solidity ^0.5.10;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";


/**
 * @title SafeMintable
 * @dev These contracts guide the user into building an ERC20 cryptocurrency.
 */
contract SafeMintable is Ownable {
    using SafeMath for uint256;

    event Transferred(address recipient, uint256 amount);
    event Minted(uint256 amount);
    event Burnt(uint256 amount);

    mapping (address => uint256) internal balances;

    constructor ()
        Ownable()
        public
    {}

    function transfer(address recipient, uint256 amount)
        public
    {
        balances[msg.sender] = balances[msg.sender].sub(amount);
        balances[recipient] = balances[recipient].add(amount);
        emit Transferred(recipient, amount);
    }

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
        emit Burnt(amount);
    }

    function balanceOf(address account)
        public
        view
        returns (uint256)
    {
        return balances[account];
    }
}