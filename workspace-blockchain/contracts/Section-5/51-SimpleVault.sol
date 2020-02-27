pragma solidity ^0.5.10;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";


contract SimpleVault is Ownable {
    ERC20 public currency;

    /// @dev Instantiate token contract
    constructor (address currencyAddress) public Ownable() {
        currency = ERC20(currencyAddress);
    }

    /// @dev Release stored tokens in the contract.
    function release() public onlyOwner {
        uint256 vaultBalance = currency.balanceOf(address(this));
        currency.transfer(owner(), vaultBalance);
    }
}