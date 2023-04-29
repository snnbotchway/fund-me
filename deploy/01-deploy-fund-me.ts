import { network } from "hardhat"
import { HardhatRuntimeEnvironment } from "hardhat/types"

export default async ({
    getNamedAccounts,
    deployments,
}: HardhatRuntimeEnvironment) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const networkName = network.name
}
