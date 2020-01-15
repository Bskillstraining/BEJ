pragma solidity ^0.5.10;

import "@openzeppelin/contracts/ownership/Ownable.sol";


/**
 * @title Ownable Table
 * @dev Learn about inheritance.
 */
contract OwnableTable is Ownable {
    mapping (uint256 => uint256) private table;

    constructor () Ownable()
        public
    {}

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