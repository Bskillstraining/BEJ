pragma solidity ^0.5.10;


contract EthVault {

    mapping (address => uint256) internal holdings;

    /// @dev Store ether in the contract.
    function store() public payable {
        require(holdings[msg.sender] == 0, "Already holding.");
        holdings[msg.sender] = msg.value;
    }

    /// @dev Release ether stored in the contract to a recipient.
    /// @param recipient Who to send the tokens to.
    function release(address payable recipient) public {
        require(holdings[msg.sender] != 0, "Not holding.");
        uint256 amount = holdings[msg.sender];
        delete holdings[msg.sender];
        recipient.transfer(amount);
    }
}