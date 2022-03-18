# `Near Fungible Token Example`

[Check this Medium article](https://medium.com/@stefano.convertino/how-to-create-and-deploy-a-fungible-token-on-near-network-b9cd8aec721), to learn how to build and deploy this repo.

# 📄 Introduction

This repository shows you how to use OpenBlimp to create a fungible token for the Near Protocol.

## Prerequisites

1. Sign up for a near testnet account (https://wallet.testnet.near.org/create).
2. Make sure you've installed Node.js ≥ 12
3. Install the NEAR CLI globally: [near-cli] is a command line interface (CLI) for interacting with the NEAR blockchain.
4. Install dependencies: `yarn install`

## Build and deploy your Fungible Token

1. Build the smart contract:
   `yarn build:release`
2. Deploy the smart contract
   ` near dev-deploy --wasmFile ./build/release/main.wasm --accountId <Your Near Test Account Id>`
3. (Optional) In the `src/main/assembly/index.ts` file, you can modify the function ft_initialize` to replace the stub parameters with your own parameters.
4. Use near-cli to initialize your fungible token
   `near call <Your Contract Account> ft_init --account-id <Your Near Test Account Id>`
   (In the scripts folder you can find some files with a lot of useful commands.)
5. Mint some token in your address: `near call $CONTRACT ft_mint '{"account":$ID_ACCOUNT,"amount":"100"}' --account-id $ID_ACCOUNT`
6. Launch your Near wallet and begin interacting with your new token.
