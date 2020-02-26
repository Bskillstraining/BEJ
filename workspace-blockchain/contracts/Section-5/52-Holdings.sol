pragma solidity ^0.5.10;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract Holdings {

    IERC20 public currencyToken;

    mapping (address => uint256) internal holdings;

    /// @dev Instantiate token contracts
    constructor (address currencyTokenAddress) public {
        currencyToken = IERC20(currencyTokenAddress);
    }

    /// @dev Store tokens in the contract.
    /// @param amount How many tokens to store.
    function store(uint256 amount) public {
        require(holdings[msg.sender] == 0, "Already holding.");
        currencyToken.transferFrom(msg.sender, address(this), amount);
        holdings[msg.sender] = amount;
    }

    /// @dev Release stored tokens in the contract to a recipient.
    /// @param recipient Who to send the tokens to.
    function release(address recipient) public {
        require(holdings[msg.sender] != 0, "Not holding.");
        uint256 amount = holdings[msg.sender];
        delete holdings[msg.sender];
        currencyToken.transfer(recipient, amount);
    }
}