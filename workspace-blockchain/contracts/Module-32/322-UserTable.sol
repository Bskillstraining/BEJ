pragma solidity ^0.5.10;


/**
 * @title User Table
 * @dev Learn about msg.sender.
 */
contract UserTable {
    mapping (address => uint256) private table;

    /**
     * @dev Store a value for the user, without impact on the values stored by other users.
     */
    function set(uint256 value)
        public
    {
        table[msg.sender] = value;
    }

    /**
     * @dev Retrieve the value stored by the user.
     */
    function get()
        public
        view
        returns (uint256)
    {
        return table[msg.sender];
    }
}