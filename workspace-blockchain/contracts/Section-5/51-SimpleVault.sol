pragma solidity ^0.5.10;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";


contract SimpleVault is Ownable {
    IERC20 public currencyToken;

    /// @dev Instantiate token contract
    constructor (address currencyTokenAddress) public Ownable() {
        currencyToken = IERC20(currencyTokenAddress);
    }

    /// @dev Release stored tokens in the contract.
    function release() public onlyOwner {
        uint256 vaultBalance = currencyToken.balanceOf(address(this));
        currencyToken.transfer(owner(), vaultBalance);
    }
}