pragma solidity ^0.5.10;


/// @dev Learn about mappings.
contract SimpleTable {
    mapping (uint256 => uint256) private table;

    /// @dev Store a value in the contract.
    function set(uint256 key, uint256 value) public {
        table[key] = value;
    }

    /// @dev Retrieve a value from the contract.
    function get(uint256 key) public view returns (uint256) {
        return table[key];
    }
}