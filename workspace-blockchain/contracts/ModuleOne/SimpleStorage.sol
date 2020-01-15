pragma solidity ^0.5.10;


/**
 * @title Simple Storage
 * @dev A simple contract to save a number.
 */
contract SimpleStorage {

    uint256 private storedData;

    /**
     * @dev Set the number to be saved.
     * @param x uint256 The number to be saved.
     */
    function set(uint256 x) public {
        storedData = x;
    }

    /**
     * @dev Gets the saved number.
     * @return An uint256 representing the saved number.
     */
    function get() public view returns (uint256) {
        return storedData;
    }
}
