pragma solidity ^0.5.10;


/**
 * @title Proprietary Table
 * @dev Learn about constructor and require.
 */
contract ProprietaryTable {
    address public owner;
    mapping (address => uint256) private table;

    /**
     * @dev The constructor takes the address deploying the contract as the owner.
     */
    constructor ()
        public
    {
        owner = msg.sender;
    }

    /**
     * @dev Store a value relative to an address, only executable by the contract owner.
     */
    function set(address key, uint256 value)
        public
    {
        require(msg.sender == owner, "Restricted to owner.");
        table[key] = value;
    }

    /**
     * @dev Retrieve the value stored stored relative to an address.
     */
    function get(address key)
        public
        view
        returns (uint256)
    {
        return table[key];
    }
}