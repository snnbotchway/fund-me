import NetworkConfig from "./types/networkConfig"

export const networkConfig: NetworkConfig = {
    11155111: {
        name: "sepolia",
        ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    },
}

export const minimumUsdContribution = 1000

export const mockArgs = { decimals: 8, initialAnswer: 200000000000 }

export const developmentNetworks = ["hardhat", "localhost"]
