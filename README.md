# Gatr - A Token Gating Service Project for ETHDenver 2022 #BUIDLATHON

## Getting started

1. Run `npm install` to install node modules and dependencies.

2. Run `npm start` to initialize web app locally

* Smart contract addresses should be deployed and tracked in .env files

## Useful NPM commands

```shell
npm start - runs teh app in development mode on (http://localhost:3000)
npm test - opens app in interactive watch mode
npm run build - builds the app for production into "build" folder
```

## Useful Hardhat commands

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```

## Backlog
1. Allow adding multiple rules (already allowed by smart contract)
2. Show existing NFTs in wallet as recommendations
3. Extend support to ERC-20 and ERC-1155
4. Use data from oracles like Chainlink
5. ???