pragma solidity ^0.5.10;
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


/// @dev Implements a very simple issuance process for tokens
contract IssuanceEth is Ownable, ERC20 {
    using SafeMath for uint256;

    event InvestmentAdded(address investor, uint256 amount);
    event InvestmentCancelled(address investor, uint256 amount);

    bool live;
    uint256 public price;
    mapping(address => uint256) public investments;
    ERC20 public currency;

    constructor(uint256 issuePrice, address currencyAddress) public Ownable() ERC20() {
        price = issuePrice;
        currency = ERC20(currencyAddress);
    }

    /// @dev Function for an investor to cancel his investment
    function cancelInvestment() external {
        require (live == false, "Cannot cancel if live.");
        uint256 amount = investments[msg.sender];
        delete investments[msg.sender];
        currency.transfer(msg.sender, amount);
        emit InvestmentCancelled(msg.sender, amount);
    }

    /// @dev Use this function to claim your issuance tokens
    function claim() external {
        require(live == true, "Cannot claim until live.");
        uint256 investment = investments[msg.sender];
        uint256 issuanceTokens = investment.div(price);
        delete investments[msg.sender];
        mint(msg.sender, issuanceTokens);
    }

    /// @dev Invest into the issuance by sending ether to this function
    function invest(uint256 amount) public {
        require(live == false, "Cannot invest if live.");
        require(
            amount.mod(price) == 0,
            "Fractional investments not allowed."
        );
        investments[msg.sender] = investments[msg.sender].add(amount);
        emit InvestmentAdded(msg.sender, amount);
    }

    /// @dev Function to move to the distributing phase
    function goLive() public onlyOwner {
        live = true;
    }

    /// @dev Function to transfer all collected tokens to the wallet of the owner
    function withdraw() public onlyOwner {
        require(live == true, "Cannot withdraw until live.");
        currency.transfer(owner(), currency.balanceOf(address(this)));
    }
}