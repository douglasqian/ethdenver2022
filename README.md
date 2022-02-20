# Gatr - A Token Gating Service Project for ETHDenver 2022 #BUIDLATHON

[![Add to Homescreen](https://img.shields.io/badge/Skynet-Add%20To%20Homescreen-00c65e?logo=skynet&labelColor=0d0d0d)](https://homescreen.hns.siasky.net/#/skylink/_AG4E5JjtN24VckgM48iytC1yXdH8y98lGIb0gI9eDK3ww)


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

## Features
- Allow adding/removing multiple rules
- Use data from oracles like Chainlink
- Extend support to ERC-20 and ERC-1155
- Managing locks (listing your locks, login)

## Polish
- Redirect UX (you need "X", list tokens we are checking for, unlock button)
- Initial connection (button)
- Recommend NFTs based on what's in your wallet
- Handle multiple accounts in a wallet
