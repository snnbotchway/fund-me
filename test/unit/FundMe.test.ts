import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers"
import { expect } from "chai"
import { ethers, deployments, network } from "hardhat"

import { FundMe, MockV3Aggregator } from "../../typechain-types/"
import {
    developmentNetworks,
    minimumUsdContribution,
    mockArgs,
} from "../../helper-hardhat-config"

!developmentNetworks.includes(network.name)
    ? describe.skip
    : describe("FundMe", () => {
          const minimumContributionInEth =
              minimumUsdContribution /
              (mockArgs.initialAnswer / 10 ** mockArgs.decimals)

          const sendAmount = ethers.utils.parseEther(
              minimumContributionInEth.toString()
          )

          const deployFundMeFixture = async () => {
              const allSigners = await ethers.getSigners() // Returns address array of accounts
              const [deployer, secondAccount] = allSigners

              await deployments.fixture()

              const fundMe: FundMe = await ethers.getContract("FundMe", deployer)
              const mockV3Aggregator: MockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              )

              return {
                  fundMe,
                  mockV3Aggregator,
                  deployer,
                  secondAccount,
                  allSigners,
              }
          }

          describe("constructor", async () => {
              it("sets the aggregator address correctly", async () => {
                  const { fundMe, mockV3Aggregator } = await loadFixture(
                      deployFundMeFixture
                  )

                  const priceFeed = await fundMe.priceFeed()

                  expect(priceFeed).to.equal(mockV3Aggregator.address)
              })

              it("sets the owner to the deployer", async () => {
                  const { fundMe, deployer } = await loadFixture(deployFundMeFixture)

                  const owner = await fundMe.owner()

                  expect(owner).to.equal(deployer.address)
              })

              it("sets the minimum contribution correctly", async () => {
                  const { fundMe } = await loadFixture(deployFundMeFixture)
                  const expectedValue = BigInt(minimumUsdContribution) * 10n ** 18n

                  const minimumContributionInUSDTimes10exp18 =
                      await fundMe.minimumContributionInUSDTimes10exp18()

                  expect(minimumContributionInUSDTimes10exp18).to.equal(expectedValue)
              })

              it("creates empty funders array", async () => {
                  const { fundMe } = await loadFixture(deployFundMeFixture)

                  await expect(fundMe.funders(0)).to.be.reverted
              })
          })

          describe("receive", () => {
              it("should call the fund function", async () => {
                  const { fundMe, secondAccount } = await loadFixture(
                      deployFundMeFixture
                  )
                  const expectedAmount = ethers.utils.parseEther(
                      minimumContributionInEth.toString()
                  )

                  await secondAccount.sendTransaction({
                      to: fundMe.address,
                      value: expectedAmount,
                  })

                  const funder = await fundMe.funders(0)
                  const amountFunded = await fundMe.contributions(funder)
                  expect(funder).to.equal(secondAccount.address)
                  expect(amountFunded).to.equal(expectedAmount)
              })
          })

          describe("fallback", () => {
              it("should call the fund function", async () => {
                  const { fundMe, secondAccount } = await loadFixture(
                      deployFundMeFixture
                  )
                  const expectedAmount = ethers.utils.parseEther(
                      minimumContributionInEth.toString()
                  )

                  await secondAccount.sendTransaction({
                      to: fundMe.address,
                      value: expectedAmount,
                      data: "0x01",
                  })

                  const funder = await fundMe.funders(0)
                  const amountFunded = await fundMe.contributions(funder)
                  expect(funder).to.equal(secondAccount.address)
                  expect(amountFunded).to.equal(expectedAmount)
              })
          })

          describe("withdraw", () => {
              it("allows the owner to withdraw", async () => {
                  const { fundMe, deployer, allSigners } = await loadFixture(
                      deployFundMeFixture
                  )
                  for (const account of allSigners) {
                      await fundMe.connect(account).fund({ value: sendAmount }) // all accounts fund the contract
                  }
                  const totalContribution = sendAmount.mul(allSigners.length)

                  await expect(fundMe.withdraw()).to.changeEtherBalances(
                      [deployer, fundMe],
                      [totalContribution, totalContribution.mul(-1)] // negate the second sendAmount
                  )

                  for (const funder of allSigners) {
                      const contributionAmount = await fundMe.contributions(
                          funder.address
                      )
                      expect(contributionAmount).to.equal(0) // expect contributions to be reset
                  }
                  await expect(fundMe.funders(0)).to.be.rejected // expect empty funders array
              })

              it("allows only the owner to withdraw", async () => {
                  const { fundMe, secondAccount } = await loadFixture(
                      deployFundMeFixture
                  )

                  await expect(
                      fundMe.connect(secondAccount).withdraw()
                  ).to.be.revertedWithCustomError(fundMe, "Unauthorized")
              })
          })

          describe("fund", () => {
              it("allows anyone to contribute", async () => {
                  const { fundMe, secondAccount } = await loadFixture(
                      deployFundMeFixture
                  )

                  await fundMe.connect(secondAccount).fund({ value: sendAmount })
                  await fundMe.connect(secondAccount).fund({ value: sendAmount })

                  const amountContributed = await fundMe.contributions(
                      secondAccount.address
                  )
                  expect(amountContributed).to.equal(sendAmount.mul(2))
                  expect(await fundMe.funders(0)).to.equal(secondAccount.address)
                  expect(await fundMe.funders(1)).to.equal(secondAccount.address)
                  await expect(fundMe.funders(2)).to.be.reverted // expect empty third index of funders array
              })

              it("requires the minimum amount", async () => {
                  const { fundMe } = await loadFixture(deployFundMeFixture)
                  const ethLessThanMinimumContribution = minimumContributionInEth - 0.01
                  const sendAmount = ethers.utils.parseEther(
                      ethLessThanMinimumContribution.toString()
                  )

                  await expect(
                      fundMe.fund({ value: sendAmount })
                  ).to.be.revertedWithCustomError(fundMe, "InsufficientContribution")
              })

              it("reverts if the price feed is outdated", async () => {
                  const { fundMe } = await deployFundMeFixture()

                  await time.increase(time.duration.hours(1)) // advance the block timestamp by 1 hour

                  await expect(
                      fundMe.fund({ value: sendAmount })
                  ).to.be.revertedWithCustomError(fundMe, "OutdatedFeed")
              })
          })
      })
