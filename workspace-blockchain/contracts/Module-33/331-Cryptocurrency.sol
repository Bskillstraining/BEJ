pragma solidity ^0.5.10;

import "@openzeppelin/contracts/ownership/Ownable.sol";


/**
 * @title Cryptocurrency
 * @dev These contracts guide the user into building an ERC20 cryptocurrency.
 */
contract Cryptocurrency {
    event Transferred(address recipient, uint256 amount);

    mapping (address => uint256) private balances;

    constructor (uint256 totalSupply)
        public
    {
        balances[msg.sender] = totalSupply;
    }

    function transfer(address recipient, uint256 amount)
        public
    {
        require(balances[msg.sender] >= amount, "Insuficcient balance.");
        balances[msg.sender] -= amount;
        balances[recipient] += amount;
        emit Transferred(recipient, amount);
    }

    function balanceOf(address account)
        public
        view
        returns (uint256)
    {
        return balances[account];
    }
}