import { network } from "hardhat"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"

import {
    developmentNetworks,
    minimumUsdContribution,
    networkConfig,
} from "../helper-hardhat-config"
import verify from "../utils/verifyContract"

const deployFundMe: DeployFunction = async ({
    getNamedAccounts,
    deployments,
}: HardhatRuntimeEnvironment) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    let ethUsdPriceFeedAddress: string
    const isDevMode = developmentNetworks.includes(network.name)

    if (isDevMode) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[network.name].ethUsdPriceFeed
    }

    const args = [minimumUsdContribution, ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args,
        log: true,
        waitConfirmations: !isDevMode
            ? networkConfig[network.name].blockConfirmations
            : 1,
    })

    if (!isDevMode && process.env.ETHERSCAN_API_KEY) {
        await verify(fundMe.address, args)
    }
    log("=====================================================================")
}

deployFundMe.tags = ["fundMe"]
export default deployFundMe
