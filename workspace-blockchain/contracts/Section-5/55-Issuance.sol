pragma solidity ^0.5.10;
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


/// @dev Implements a very simple issuance process for tokens
contract Issuance is Ownable, ERC20 {
    using SafeMath for uint256;

    event Invested(address investor, uint256 investment);
    event Cancelled(address investor);
    event Claimed(address investor, uint256 tokens);
    event Withdrawn(uint256 proceedings);
    event GoneLive();

    bool live;
    uint256 public price;
    mapping(address => uint256) public investments;
    ERC20 public currency;

    constructor(uint256 issuePrice, address currencyAddress)
        public Ownable() ERC20()
    {
        price = issuePrice;
        currency = ERC20(currencyAddress);
    }

    /// @dev Invest into the issuance by sending ether to this function
    function invest(uint256 investment) public {
        require(live == false, "Cannot invest if live.");
        require(
            investment.mod(price) == 0,
            "Cannot invest a fraction of the price."
        );
        currency.transferFrom(msg.sender, address(this), investment);
        investments[msg.sender] = investments[msg.sender].add(investment);
        emit Invested(msg.sender, investment);
    }

    /// @dev Function for an investor to cancel his investment
    function cancel() public {
        require (live == false, "Cannot cancel if live.");
        uint256 investment = investments[msg.sender];
        delete investments[msg.sender];
        currency.transfer(msg.sender, investment);
        emit Cancelled(msg.sender);
    }

    /// @dev Use this function to claim your issuance tokens
    function claim() public {
        require(live == true, "Cannot claim until live.");
        uint256 investment = investments[msg.sender];
        uint256 tokens = investment.div(price);
        delete investments[msg.sender];
        _mint(msg.sender, tokens);
        emit Claimed(msg.sender, tokens);
    }

    /// @dev Function to move to the distributing phase
    function goLive() public onlyOwner {
        live = true;
        emit GoneLive();
    }

    /// @dev Function to transfer all collected tokens to the wallet of the owner
    function withdraw() public onlyOwner {
        require(live == true, "Cannot withdraw until live.");
        uint256 proceedings = currency.balanceOf(address(this));
        currency.transfer(owner(), proceedings);
        emit Withdrawn(proceedings);
    }
}