import { expect } from "chai"
import { ethers, network } from "hardhat"

import { FundMe } from "../../typechain-types/"
import { developmentNetworks } from "../../helper-hardhat-config"

developmentNetworks.includes(network.name)
    ? describe.skip
    : describe("FundMe", () => {
          const sendAmount = ethers.utils.parseEther("0.1")

          const deployFundMe = async () => {
              const [deployer] = await ethers.getSigners()

              const fundMe: FundMe = await ethers.getContract("FundMe", deployer)

              return fundMe
          }

          it("allows funding and withdrawing", async () => {
              const fundMe = await deployFundMe()

              await fundMe.fund({ value: sendAmount })

              await fundMe.withdraw()

              const endingBalance = await ethers.provider.getBalance(fundMe.address)
              expect(endingBalance).to.equal(0)
          })
      })
