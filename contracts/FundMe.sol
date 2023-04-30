// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import {AggregatorV3Interface, PriceConverter} from "./PriceConverter.sol";

error InsufficientContribution();
error OutdatedFeed();
error Unauthorized();
error WithdrawalFailed();

/// @author Solomon Botchway
/// @title A crowdfunding contract
/// @notice This is just a demo contract to demonstrate crowfunding
/// @dev This makes use of chainlink's price feeds
contract FundMe {
    using PriceConverter for uint256;

    uint256 public immutable minimumContributionInUSDTimes10exp18;
    address public immutable owner;
    AggregatorV3Interface public immutable priceFeed;

    mapping(address => uint) public contributions;
    address[] public funders;

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert Unauthorized();
        }
        _;
    }

    /// @param _priceFeed is the address of the price feed contract
    /// @param _minimumContributionInUSD is minimum contribution ammount in USD
    /// @dev The minimum USD contribution is multiplied by 10**18 before being stored
    /// This is to make the fund function more gas efficient by avoiding a division of 10**18
    /// every time the fund function is called
    constructor(uint256 _minimumContributionInUSD, address _priceFeed) {
        owner = msg.sender;
        minimumContributionInUSDTimes10exp18 = _minimumContributionInUSD * (10 ** 18);
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    /// @notice Withdraw all the funds in the contract
    /// @dev only the owner can call this function and the contributors are reset
    function withdraw() external onlyOwner {
        address[] memory _funders = funders;
        uint256 fundersLength = _funders.length;

        for (uint256 funderIndex = 0; funderIndex < fundersLength; funderIndex++) {
            contributions[_funders[funderIndex]] = 0;
        }
        funders = new address[](0);

        (bool success, ) = payable(msg.sender).call{value: address(this).balance}("");
        if (!success) {
            revert WithdrawalFailed();
        }
    }

    /// @notice Make a contribution to the contract
    /// @dev USD price is retrieved from chainlink pricefeed
    function fund() public payable {
        (uint256 amountInUsdTimesTimes10exp18, uint256 updatedAt) = msg.value.getUsdData(priceFeed);

        if (amountInUsdTimesTimes10exp18 < minimumContributionInUSDTimes10exp18) {
            revert InsufficientContribution();
        }
        if (block.timestamp - updatedAt > 1 hours) {
            revert OutdatedFeed();
        }

        contributions[msg.sender] += msg.value;
        funders.push(msg.sender);
    }
}
