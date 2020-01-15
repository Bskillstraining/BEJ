pragma solidity ^0.5.10;


/**
 * @title Modifier Table
 * @dev Learn about modifiers.
 */
contract ModifierTable {
    address public owner;
    mapping (uint256 => uint256) private table;

    constructor ()
        public
    {
        owner = msg.sender;
    }

    modifier onlyOwner()
    {
        require(msg.sender == owner, "Restricted to owner.");
        _;
    }

    function set(uint256 key, uint256 value)
        public
        onlyOwner
    {
        table[key] = value;
    }

    function get(uint256 key)
        public
        view
        returns (uint256)
    {
        return table[key];
    }
}