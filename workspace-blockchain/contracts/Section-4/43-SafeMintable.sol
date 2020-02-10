pragma solidity ^0.5.10;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";


/// @dev A cryptocurrency safe against overflow exploits
contract SafeMintable is Ownable {
    using SafeMath for uint256;

    event Transferred(address recipient, uint256 amount);
    event Minted(uint256 amount);
    event Burnt(uint256 amount);

    mapping (address => uint256) internal balances;

    /// @dev Initializes the cryptocurrency with a contract owner.
    constructor ()
        Ownable()
        public
    {}

    /// @dev Transfers currency from the account of the caller to another account.
    function transfer(address recipient, uint256 amount)
        public
    {
        balances[msg.sender] = balances[msg.sender].sub(amount);
        balances[recipient] = balances[recipient].add(amount);
        emit Transferred(recipient, amount);
    }

    /// @dev Create more currency in the account of the owner.
    function mint(uint256 amount)
        public
        onlyOwner
    {
        balances[owner()] = balances[owner()].add(amount);
        emit Minted(amount);
    }

    /// @dev Destroy currency from the account of the owner.
    function burn(uint256 amount)
        public
    {
        balances[owner()] = balances[owner()].sub(amount);
        emit Burnt(amount);
    }

    /// @dev Returns the balance of an account.
    function balanceOf(address account)
        public
        view
        returns (uint256)
    {
        return balances[account];
    }
}