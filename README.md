# Hardhat Project

FundMe is a Hardhat project that serves as a useful guide and template for other Hardhat projects.

1. ```bash
   yarn add --dev hardhat
   yarn hardhat
   ```

2. Using `solhint`

    ```bash
    yarn add @nomiclabs/hardhat-solhint
    yarn solhint --init
    ```

    Copy `.solhint.json` into the project.

    import `@nomiclabs/hardhat-solhint` in hardhat config.

    ```bash
    yarn solhint contracts/*.sol
    ```
