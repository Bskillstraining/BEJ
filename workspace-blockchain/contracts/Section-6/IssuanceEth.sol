pragma solidity ^0.5.10;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";


/**
 * @title Issuance
 * @notice Implements a very simple issuance process for tokens
 *
 * 1. Initialize contract with the issuance token contract address. This address must inherit from `ERC20Mintable` and `ERC20Detailed`.
 * 2. Use `setIssuePrice` to determine how many ether (in wei) do investors
 *    have to pay for each issued token.
 * 3. Use `startIssuance` to allow investors to invest.
 * 4. Investors can `invest` their ether at will.
 * 5. Investors can also `cancelInvestment` and get their ether back.
 * 6. The contract owner can `cancelAllInvestments` to close the investment phase.
 *    In this case `invest` is not available, but `cancelInvestment` is.
 * 7. Use `startDistribution` to close the investment phase.
 * 8. Investors can only `claim` their issued tokens now.
 * 9. Owner can use `withdraw` to send collected ether to a wallet.
 */
contract IssuanceEth is Ownable, ERC20, ERC20Detailed {
    using SafeMath for uint256;
    enum State{ OPEN, LIVE }

    event IssuanceCreated();
    event IssuePriceSet();
    event InvestmentAdded(address investor, uint256 amount);
    event InvestmentCancelled(address investor, uint256 amount);

    State state;

    address[] public investors;
    mapping(address => uint256) public investments;

    uint256 public amountRaised;
    uint256 public amountWithdrawn;
    uint256 public issuePrice;

    constructor(
        string memory _name, string memory _symbol, uint8 _decimals, uint256 _issuePrice
    ) public Ownable() ERC20() ERC20Detailed(_name, _symbol, _decimals) {
        state = State.OPEN;
        issuePrice = _issuePrice;
    }

    /**
     * @notice Invest into the issuance by sending ether to this function
     */
    function invest() public payable {
        require(
            state == State.OPEN,
            "Not open for investments."
        );
        require(
            msg.value.mod(issuePrice) == 0,
            "Fractional investments not allowed."
        );
        if (investments[msg.sender] == 0){
            investors.push(msg.sender);
        }
        investments[msg.sender] = investments[msg.sender].add(msg.value);
        amountRaised = amountRaised.add(msg.value);
        emit InvestmentAdded(msg.sender, msg.value);
    }

    /**
     * @dev Function for an investor to cancel his investment
     */
    function cancelInvestment() external {
        require (
            state == State.OPEN,
            "Cannot cancel now."
        );
        require(
            investments[msg.sender] > 0,
            "No investments found."
        );
        uint256 amount = investments[msg.sender];
        investments[msg.sender] = 0;
        msg.sender.transfer(amount);
        emit InvestmentCancelled(msg.sender, amount);
    }

    /**
     * @dev Function to move to the distributing phase
     */
    function startDistribution() public onlyOwner {
        state = State.LIVE;
    }

    /**
     * @notice Use this function to claim your issuance tokens
     * @dev Each user will call this function on his behalf
     */
    function claim() external {
        require(
            state == State.LIVE,
            "Cannot claim yet."
        );
        require(
            investments[msg.sender] > 0,
            "No investments found."
        );
        uint256 investment = investments[msg.sender];
        uint256 issuanceTokens = investment.div(issuePrice);
        investments[msg.sender] = 0;
        _mint(msg.sender, issuanceTokens);
    }

    /**
     * @dev Function to transfer all collected tokens to the wallet of the owner
     */
    function withdraw() public onlyOwner {
        /*require(
            state = State.LIVE,
            "Cannot withdraw funds now."
        );*/
        // payable(owner).transfer(amountRaised); // Solidity >= 0.6
        address(uint160(owner())).transfer(amountRaised); // Solidity >= 0.5
        // https://ethereum.stackexchange.com/questions/64108/whats-the-difference-between-address-and-address-payable
    }
}