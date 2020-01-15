pragma solidity ^0.5.10;

import "@openzeppelin/contracts/ownership/Ownable.sol";


/**
 * @title Document Registry
 * @dev Real use case: This contract is my personal registry of documents I've verified.
 * Anyone with any document can calculate its hash and if they know the address of this
 * contract assess whether it's a document I've verified or not.
 */
contract DocumentRegistry is Ownable {
    event EntryAdded(uint256 hash);

    mapping (uint256 => uint256) private registry;

    constructor () Ownable()
        public
    {}

    function set(uint256 hash)
        public
        onlyOwner
    {
        registry[hash] = now;
        emit EntryAdded(hash);
    }

    function get(uint256 hash)
        public
        view
        returns (uint256)
    {
        return registry[hash];
    }
}