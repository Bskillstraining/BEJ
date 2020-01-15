pragma solidity ^0.5.10;


/**
 * @title Proprietary Table
 * @dev Learn about constructor and require.
 */
contract ProprietaryTable {
    address public owner;
    mapping (uint256 => uint256) private table;

    constructor ()
        public
    {
        owner = msg.sender;
    }

    function set(uint256 key, uint256 value)
        public
    {
        require(msg.sender == owner, "Restricted to owner.");
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