pragma solidity ^0.5.10;
import "@openzeppelin/contracts/ownership/Ownable.sol";


/// @dev My own exclusive club. You can pay a fee to be a member.
contract EthClub is Ownable {
    event MemberAdded(address member);
    uint256 public fee;
    mapping (address => uint256) private registry;

    /// @dev Sets the owner and membership fee.
    constructor (uint256 f) Ownable() public {
        fee = f;
    }

    /// @dev Allows an address to register or renew as a member.
    function register() public payable {
        require(msg.value == fee, "Please pay the exact fee.");
        registry[msg.sender] = block.number;
        emit MemberAdded(msg.sender);
    }

    /// @dev Get an address' membership
    function get(address member) public view returns (uint256) {
        return registry[member];
    }

    /// @dev Only owner. Retrieve all ether in the contract.
    function withdraw() public onlyOwner {
        msg.sender.transfer(address(this).balance);
    }
}