pragma solidity ^0.5.10;

import "@openzeppelin/contracts/ownership/Ownable.sol";


/**
 * @title Event Table
 * @dev Learn about events.
 */
contract EventTable is Ownable {
    event ValueAdded(uint256 key, uint256 value);

    mapping (uint256 => uint256) private table;

    constructor () Ownable()
        public
    {}

    function set(uint256 key, uint256 value)
        public
        onlyOwner
    {
        table[key] = value;
        emit ValueAdded(key, value);
    }

    function get(uint256 key)
        public
        view
        returns (uint256)
    {
        return table[key];
    }
}