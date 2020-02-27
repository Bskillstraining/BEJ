pragma solidity ^0.5.10;


contract EthVault {

    mapping (address => uint256) internal vault;

    /// @dev Store ether in the contract.
    function deposit() public payable {
        vault[msg.sender] += msg.value;
    }

    /// @dev Release ether stored in the contract to a recipient.
    /// @param recipient Who to send the tokens to.
    function release(address payable recipient) public {
        uint256 amount = vault[msg.sender];
        delete vault[msg.sender];
        recipient.transfer(amount);
    }
}