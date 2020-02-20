pragma solidity ^0.5.10;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";


/**
 * @title Classifieds
 * @notice Implements a simple classifieds board market. The market will be governed
 * by an ERC20 token as currency, and an ERC721 token that represents the ownership
 * of the items being traded. Only ads for selling items are implemented and only one
 * simultaneous trade per trade is allowed. The item tokenization is responsibility
 * of the ERC721 contract which should encode any item details.
 */
contract Classifieds {
    event Posted(address seller, uint256 item, uint256 price);
    event Sold(address seller, address buyer);
    event Cancelled(address seller);

    IERC20 currencyToken;
    IERC721 itemToken;

    struct Trade {
        address seller;
        uint256 item;
        uint256 price;
    }

    mapping(address => Trade) public trades;

    /// @dev Instantiate token contracts
    constructor (address _currencyTokenAddress, address _itemTokenAddress) public {
        currencyToken = IERC20(_currencyTokenAddress);
        itemToken = IERC721(_itemTokenAddress);
    }

    /// @dev Posts a new trade. Puts item in escrow.
    /// @param item The id for the item to trade.
    /// @param price The amount of currency for which to trade the item.
    function post(uint256 item, uint256 price) public {
        itemToken.transferFrom(msg.sender, address(this), item);
        trades[msg.sender] = Trade({
            seller: msg.sender,
            item: item,
            price: price
        });
        emit Posted(msg.sender, item, price);
    }

    /// @dev Executes a trade. Must have approved this contract to transfer the amount of currency
    /// specified to the seller. Transfers ownership of the item to the buyer.
    /// @param seller The address of the trade poster
    function buy(address seller) public {
        Trade memory trade = trades[seller];
        require(trade.seller != address(0), "Nothing posted.");

        delete trades[seller];
        currencyToken.transferFrom(msg.sender, trade.seller, trade.price);
        itemToken.transferFrom(address(this), msg.sender, trade.item);
        emit Sold(seller, msg.sender);
    }

    /// @dev Cancels a trade by its poster and returns the item.
    function cancel() public {
        Trade memory trade = trades[msg.sender];
        require(trade.seller != address(0), "Nothing posted.");

        delete trades[msg.sender];
        itemToken.transferFrom(address(this), msg.sender, trade.item);
        emit Cancelled(msg.sender);
    }
}