pragma solidity ^0.5.10;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract TokenVault {

    ERC20 public currency;

    mapping (address => uint256) internal vault;

    /// @dev Instantiate token contracts
    constructor (address currencyAddress) public {
        currency = ERC20(currencyAddress);
    }

    /// @dev Store tokens in the contract.
    /// @param amount How many tokens to store.
    function deposit(uint256 amount) public {
        currency.transferFrom(msg.sender, address(this), amount);
        vault[msg.sender] = amount;
    }

    /// @dev Release stored tokens in the contract back to its owner
    function retrieve() public {
        uint256 amount = vault[msg.sender];
        delete vault[msg.sender];
        currency.transfer(msg.sender, amount);
    }
}