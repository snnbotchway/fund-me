# FundMe

FundMe is a Hardhat project that serves as a useful guide and template for other Hardhat projects.

1. ```bash
   yarn add --dev hardhat
   yarn hardhat
   ```

2. Using `solhint`

    ```bash
    yarn add --dev @nomiclabs/hardhat-solhint
    yarn solhint --init
    ```

    - Copy `.solhint.json` into the project.
    - import `@nomiclabs/hardhat-solhint` in hardhat config.

    ```bash
    yarn solhint contracts/*.sol
    ```

3. Set up prettier
   Copy `.prettierrc` into the project.

    ```bash
    yarn add --dev prettier prettier-plugin-solidity
    ```

4. Setup hardhat-deploy

    - Import `hardhat-deploy` in hardhat config
    - Create a `deploy` folder for hardhat-deploy and write your deploy scripts
    - Remember to reference this project's `hardhat.config.ts`.

    ```bash
    yarn add --dev hardhat-deploy
    yarn add --dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers
    ```

5. Mocking chainlink's AggregatorV3Interface for development and testing:

    - Add your mocks to the contracts folder
    - Write a deployment script for the contract and the mocks.
    - Use the helper hardhat config to specify different settings for each network.

6. Remember to format your contracts with the solidity style guide and NatSpec.
   Find the NatSpec tags docs at <https://docs.soliditylang.org/en/v0.8.19/natspec-format.html#tags>

7. Write your tests(staging and unit)

8. Optimize gas cost

9. Deploy!
