// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import {AggregatorV3Interface, PriceConverter} from "./PriceConverter.sol";

error InsufficientContribution();
error OutdatedFeed();
error Unauthorized();
error WithdrawalFailed();

contract FundMe {
    using PriceConverter for uint256;

    uint256 public immutable minimumContributionInUSDTimes1e18;
    address public immutable owner;
    AggregatorV3Interface private immutable priceFeed;

    constructor(uint256 _minimumContributionInUSD, address _priceFeed) {
        owner = msg.sender;
        minimumContributionInUSDTimes1e18 = _minimumContributionInUSD * 1e18;
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert Unauthorized();
        }
        _;
    }

    function fund() public payable {
        (uint256 amountInUsdTimes1e18, uint256 updatedAt) = msg
            .value
            .getUsdData(priceFeed);

        if (amountInUsdTimes1e18 < minimumContributionInUSDTimes1e18) {
            revert InsufficientContribution();
        }
        if (block.timestamp - updatedAt > 1 hours) {
            revert OutdatedFeed();
        }
    }

    function withdraw() external onlyOwner {
        (bool success, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        if (!success) {
            revert WithdrawalFailed();
        }
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }
}
