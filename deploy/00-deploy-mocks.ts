import { network } from "hardhat"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"

import { developmentNetworks, mockArgs } from "../helper-hardhat-config"

const deployMock: DeployFunction = async function ({
    getNamedAccounts,
    deployments,
}: HardhatRuntimeEnvironment) {
    const isDevMode = developmentNetworks.includes(network.name)
    if (!isDevMode) return

    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("=====================================================================")
    log(`Development network(${network.name}) detected! Deploying mocks...`)
    await deploy("MockV3Aggregator", {
        from: deployer,
        log: true,
        args: [mockArgs.decimals, mockArgs.initialAnswer],
    })
    log("=====================================================================")
}

deployMock.tags = ["mocks"]
export default deployMock
