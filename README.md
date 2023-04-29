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

    Copy `.solhint.json` into the project.

    import `@nomiclabs/hardhat-solhint` in hardhat config.

    ```bash
    yarn solhint contracts/*.sol
    ```

3. Set up prettier
   Copy `.prettierrc` into the project.

    ```bash
    yarn add --dev prettier prettier-plugin-solidity
    ```

4. Setup hardhat-deploy
   Import `hardhat-deploy` in hardhat config
   Create a `deploy` folder for hardhat-deploy and write your deploy scripts
   Remember to reference this project's `hardhat.config.ts`.

    ```bash
    yarn add hardhat-deploy
    yarn add --dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers
    ```
