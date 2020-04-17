

# Get started with DeFi examples

This is a repo containing code snippets to interact with Defi protocols through smart contracts
or with web3 using 0x-api-starter-guide-code as initial codebase. The examples are used on Veridex and internal testing of protocols. Since we saw that typed contracts can help developers check how to do simple defi tasks like lend, borrow, swap on multiple protocols, we decided to create this educational repo:

The aim it will be developing examples and posts for the follow taks:

- [ ] Lend, borrow, flashloans on Aave
- [ ] Lend and borrow on Compound
- [ ] Lend and borrow on Bzx
- [ ] Lend and borrow on DyDx
- [ ] Create reader utilities contracts for each protocol to improve frontend loading

 

Supported planned projects (List will increase with adoption):

- Aave: 
- Bzx
- Compound
- DyDx
- 0x
- ENS
- Chai

# Where to get Abi's from projects #

- Aave - https://github.com/aave/aave-protocol/tree/master/abi
- Chai - https://etherscan.io/address/0x06AF07097C9Eeb7fD685c692751D5C66dB49c215#code
- Bzx - https://artifacts.fulcrum.trade/mainnet/
- Compound - https://compound.finance/docs#networks

## TODO: ##

Create for each example an article


## Before Running the snippets

You need to run a geth instance locally, download the binaries at https://geth.ethereum.org/downloads/

then run:
```
 $ geth --rpc --syncmode light

``` 
 or if you have sufficient memory
 ```
 $ geth --rpc

``` 

## Running the snippets

Before running the scripts run:
```
$ yarn 
```
```
$ yarn generate_contract_wrappers_from_abis
```
If you need to run the contracts, build it before

```
$ yarn build:contracts
```

This codebase uses `ts-node` to run the typescript code-snippets.

## Snippets
All code snippets can be found in either `examples/` or `contracts/` (dependent to if there is any smart contract code needed for the snippet)

### 0x Snippets ###
| Main code script in `examples/0x`       | Corresponding Guide                                                                                                                       | Description                                                                                                                                                                                     |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `web3_simple_token_swap.ts`           | [Swap tokens with 0x API](https://0x.org/docs/guides/swap-tokens-with-0x-api)                                                             | Perform a token swap with web3.                                    |
| `smart_contract_token_swap.ts`        | [Use 0x API liquidity in your smart contracts](https://0x.org/docs/guides/use-0x-api-liquidity-in-your-smart-contracts)                   | Perform a token swap in a smart contract.                          |
| `smart_contract_margin_trading.ts`    | [Develop a margin trading smart contract with 0x API](https://0x.org/docs/guides/develop-a-margin-trading-smart-contract-with-0x-api)     | Develop a margin trading contract with Compound Finance + 0x.      |
 
## Need help?

This codebase is forked from 0x team started guide code, you can use the following 0x docs to understand 0x related examples, for the other examples please refer to protocol docs

* Refer to our [0x API specification](https://0x.org/docs/api) for detailed documentation.
* 0x API is open source! Look through the [codebase](https://github.com/0xProject/0x-api) and deploy your own 0x API instance.

Or get help with us at

* [Discord](https://discord.gg/cGMJemv)
* [Telegram](https://t.me/VeriSafe)

If you need a snippet that is not listed on the repo, please open a issue with detailed example:
 - Abi
 - usecase