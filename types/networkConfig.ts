export default interface NetworkConfig {
    [chainId: number]: {
        name: string
        ethUsdPriceFeed: string
    }
}
