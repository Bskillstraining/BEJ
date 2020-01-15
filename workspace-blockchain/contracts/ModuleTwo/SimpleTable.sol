pragma solidity ^0.5.10;


/**
 * @title Simple Table
 * @dev Learn about mappings.
 */
contract SimpleTable {
    mapping (uint256 => uint256) private table;

    function set(uint256 key, uint256 value)
        public
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