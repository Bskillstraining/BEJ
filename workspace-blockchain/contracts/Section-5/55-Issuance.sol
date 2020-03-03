pragma solidity ^0.5.10;
import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


/// @dev Implements a very simple issuance process for tokens
contract Issuance is Ownable, ERC20 {
    event Invested(address investor, uint256 investment);
    event Cancelled(address investor);
    event Claimed(address investor, uint256 tokens);
    event GoneLive(uint256 proceedings);

    bool public live;
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
            investment % price == 0,
            "Cannot invest a fraction of the price."
        );
        currency.transferFrom(msg.sender, address(this), investment);
        investments[msg.sender] = investments[msg.sender].add(investment);
        emit Invested(msg.sender, investment);
    }

    /// @dev Function for an investor to cancel his investment
    function cancel() public {
        require (live == false, "Cannot cancel if live.");
        currency.transfer(msg.sender, investments[msg.sender]);
        delete investments[msg.sender];
        emit Cancelled(msg.sender);
    }

    /// @dev Use this function to claim your issuance tokens
    function claim() public {
        require(live == true, "Cannot claim until live.");
        uint256 tokens = investments[msg.sender] / price;
        delete investments[msg.sender];
        _mint(msg.sender, tokens);
        emit Claimed(msg.sender, tokens);
    }

    /// @dev Function to go live and withdraw proceedings
    function goLive() public onlyOwner {
        live = true;
        uint256 proceedings = currency.balanceOf(address(this));
        currency.transfer(owner(), proceedings);
        emit GoneLive(proceedings);
    }
}