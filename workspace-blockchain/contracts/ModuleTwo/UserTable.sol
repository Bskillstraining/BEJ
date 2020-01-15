pragma solidity ^0.5.10;


/**
 * @title User Table
 * @dev Learn about msg.sender.
 */
contract UserTable {
    mapping (address => uint256) private table;

    function set(uint256 value)
        public
    {
        table[msg.sender] = value;
    }

    function get()
        public
        view
        returns (uint256)
    {
        return table[msg.sender];
    }
}