pragma solidity ^0.5.10;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract TokenVault {

    ERC20 public currencyToken;

    mapping (address => uint256) internal holdings;

    /// @dev Instantiate token contracts
    constructor (address currencyTokenAddress) public {
        currencyToken = ERC20(currencyTokenAddress);
    }

    /// @dev Store tokens in the contract.
    /// @param amount How many tokens to store.
    function deposit(uint256 amount) public {
        currencyToken.transferFrom(msg.sender, address(this), amount);
        holdings[msg.sender] = amount;
    }

    /// @dev Release stored tokens in the contract back to its owner
    function retrieve() public {
        uint256 amount = holdings[msg.sender];
        delete holdings[msg.sender];
        currencyToken.transfer(msg.sender, amount);
    }
}