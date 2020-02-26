pragma solidity ^0.5.10;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract TokenVault {

    IERC20 public currencyToken;

    mapping (address => uint256) internal holdings;

    /// @dev Instantiate token contracts
    constructor (address currencyTokenAddress) public {
        currencyToken = IERC20(currencyTokenAddress);
    }

    /// @dev Store tokens in the contract.
    /// @param amount How many tokens to store.
    function store(uint256 amount) public {
        currencyToken.transferFrom(msg.sender, address(this), amount);
        holdings[msg.sender] = amount;
    }

    /// @dev Release stored tokens in the contract back to its owner
    function release() public {
        uint256 amount = holdings[msg.sender];
        delete holdings[msg.sender];
        currencyToken.transfer(msg.sender, amount);
    }
}