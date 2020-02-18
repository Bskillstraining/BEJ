pragma solidity ^0.5.10;

import "@openzeppelin/contracts/token/ERC721/ERC721Mintable.sol";


/**
 * @dev Extension of {ERC721} that adds a set of accounts with the {MinterRole},
 * which have permission to mint (create) new tokens as they see fit.
 *
 * At construction, the deployer of the contract is the only minter.
 */
contract ERC721MintableMock is ERC721Mintable { }