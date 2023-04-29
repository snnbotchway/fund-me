// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getUsdData(
        uint256 amountInWei
    ) internal view returns (uint256, uint256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            0x694AA1769357215DE4FAC081bf1f309aDC325306
        );
        (, int256 price, , uint256 updatedAt, ) = priceFeed.latestRoundData();

        return (
            ((uint256(price) * amountInWei) /
                (10 ** (18 + priceFeed.decimals()))),
            updatedAt
        );
    }
}
