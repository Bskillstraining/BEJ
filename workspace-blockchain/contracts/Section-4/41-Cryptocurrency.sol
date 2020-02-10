pragma solidity ^0.5.10;


/// @dev The most basic example of a cryptocurrency
contract Cryptocurrency {
    event Transferred(address recipient, uint256 amount);

    mapping (address => uint256) internal balances;

    /// @dev Mints the currency supply in the account of the contract deployer.
    constructor (uint256 totalSupply)
        public
    {
        balances[msg.sender] = totalSupply;
    }

    /// @dev Transfers currency from the account of the caller to another account.
    function transfer(address recipient, uint256 amount)
        public
    {
        balances[msg.sender] -= amount;
        balances[recipient] += amount;
        emit Transferred(recipient, amount);
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