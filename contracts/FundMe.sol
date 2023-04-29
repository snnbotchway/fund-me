// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "./PriceConverter.sol";

error InsufficientContribution();
error OutdatedFeed();
error Unauthorized();
error WithdrawalFailed();

contract FundMe {
    using PriceConverter for uint256;

    uint256 public immutable minimumContributionInUSD;
    address public immutable owner;

    constructor(uint256 _minimumContributionInUSD) {
        owner = msg.sender;
        minimumContributionInUSD = _minimumContributionInUSD;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert Unauthorized();
        }
        _;
    }

    function fund() public payable {
        (uint256 amountInUsd, uint256 updatedAt) = msg.value.getUsdData();

        if (amountInUsd < minimumContributionInUSD) {
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
