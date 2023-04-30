import { HardhatUserConfig } from "hardhat/config"
import "@nomiclabs/hardhat-etherscan"
import "@nomiclabs/hardhat-solhint"
import "@nomicfoundation/hardhat-toolbox"
import "hardhat-deploy"
import "hardhat-gas-reporter"
import "solidity-coverage"
import "dotenv/config"

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || ""
const PRIVATE_KEY =
    process.env.PRIVATE_KEY ||
    "8c332a1a1a1a11a1a1e11f11aeddb111111f1111d1111b27933ef916b26f190a"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY

const config: HardhatUserConfig = {
    solidity: "0.8.18",
    // solidity: {
    //     compilers: [{ version: "0.8.18" }, { version: "0.6.0" }], // Use this to specify more compiler versions
    // },
    networks: {
        localhost: {
            url: "http://localhost:8545",
            chainId: 31337,
        },
        sepolia: {
            url: SEPOLIA_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 11155111,
        },
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enabled: true,
        outputFile: "gasReport.txt",
        noColors: true,
        currency: "GHS",
        coinmarketcap: COINMARKETCAP_API_KEY,
        token: "MATIC",
    },
    namedAccounts: {
        deployer: {
            default: 0,
            // 11155111: 1, // This means on Sepolia(11155111), the account at index 1 is the deployer
        },
    },
}

export default config
