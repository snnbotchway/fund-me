// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getUsdData(uint256 amountInWei, AggregatorV3Interface priceFeed) internal view returns (uint256, uint256) {
        (, int256 price, , uint256 updatedAt, ) = priceFeed.latestRoundData();

        return (((uint256(price) * amountInWei) / (10 ** priceFeed.decimals())), updatedAt);
    }
}
