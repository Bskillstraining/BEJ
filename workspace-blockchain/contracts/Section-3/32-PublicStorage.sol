pragma solidity ^0.5.10;


/**
 * @title Public Storage
 * @dev Learn about public contract variables.
 */
contract PublicStorage {

    uint256 public storedData;

    /**
     * @dev Set the number to be saved.
     * @param x uint256 The number to be saved.
     */
    function set(uint256 x) public {
        storedData = x;
    }
}