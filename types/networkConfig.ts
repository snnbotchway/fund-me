export default interface NetworkConfig {
    [networkName: string]: {
        ethUsdPriceFeed: string
        blockConfirmations: number
    }
}
