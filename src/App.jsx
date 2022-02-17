import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import ERC20_ABI from "./abi/erc20.json";
import ERC721_ABI from "./abi/erc721.json";
import ERC1155_ABI from "./abi/erc1155.json";
import RULES_ABI from "./abi/rules.json";
// import { createHash } from "crypto";


const App = () => {

  const { ethereum } = window;
  // token contract addr: 0xC5922438b8873000C11ba9866c87deFFeD15623A
  const rulesContractAddr = "0xc1E7ABB6Cc2C6182e7c947Cdbd251e7f1A18f12a";

  const [currentAccount, setCurrentAccount] = useState("");
  const [tokenContractAddr, setTokenContractAddr] = useState("");
  const [tokenCount, setTokenCount] = useState(1);

  const [currentHash, setCurrentHash] = useState("");

  // const [currentURL, setCurrentURL] = useState("");
  // const [rulesContractAddr, setRulesContractAddr] = useState("");

  const connectWallet = async () => {

    // Make sure wallet is connected
    if (!ethereum) {
      alert("MetaMask wallet not connected yet! Please press the connect wallet button!");
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    // Get the connected wallet's address and store it
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    if (accounts.length === 0) {
      alert("No authorized accounts found!")
    } else {
      console.log("Found %d accounts, connecting to ", accounts.length, accounts[0])
      setCurrentAccount(accounts[0]);
    }
  }


  const checkNFT = async () => {
    /*
      This function checks if the currently connected wallet account holds
      the token contract address stored in this React component.
    */

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    // Only support ERC-721 for now. Extend this to ERC-20 and ERC-1155 later.
    const tokenContract = new ethers.Contract(tokenContractAddr, ERC721_ABI, signer);

    try {
      console.log("Checking for tokens on ", tokenContractAddr);
      const balance = await tokenContract.balanceOf(currentAccount);
      const numTokens = balance.toNumber();

      if (numTokens < tokenCount) {
        alert("Not enough tokens, you only have " + numTokens);
      } else {
        alert("Woohoo! You're all good!");
      }

    } catch (error) {
      console.log(error);
      alert("No tokens found! Make sure this is a valid ERC-721 token contract address");
    }
  }

  const addRule = async () => {
    /*
      This function adds a new rule (token contract address, token count) to
      that is indexed by a hash to the smart contract's data structure.
    */
    const hash = ethers.utils.hexZeroPad("0x124", 32);
    // const crypto = require('crypto');
    // payload = (tokenContractAddr, tokenCount);
    // const hash = crypto.createHash('sha1').update(payload);
    // console.log("hash: ", hash);
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const rulesContract = new ethers.Contract(rulesContractAddr, RULES_ABI.abi, signer);

    try {
      const addTxn = await rulesContract.addRule(hash, tokenContractAddr, tokenCount);
      console.log("Txn mining...");
      await addTxn.wait();
      console.log("Txn mined!");
      console.log("Hash entered in map: ", hash);
    } catch (error) {
      console.log(error);
    }
  }

  const getRule = async (_hash) => {
    /*
      This function retrieves a rule from the smart contract given a hash in
      the redirect URL.
    */
    const hash = ethers.utils.hexZeroPad("0x124", 32);
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const rulesContract = new ethers.Contract(rulesContractAddr, RULES_ABI.abi, signer);

    try {
      const rule = await rulesContract.fetchRule(hash);
      console.log("Rule: ", rule);
      console.log("Token contract: ", rule['token_contract_address']);
      console.log("Token count: ", rule['token_count'].toNumber());
    } catch (error) {
      console.log(error);
    }
  }

  /*
  * This runs our function when the page loads.
  */
  useEffect(() => {
    connectWallet();
    console.log("gating rules contract addr: ", process.env.REACT_APP_GATING_RULES_CONTRACT_ADDRESS);
    // setRulesContractAddr(process.env.REACT_APP_GATING_RULES_CONTRACT_ADDRESS);
    // console.log("gating rules contract addr 2: ", rulesContractAddr);
  }, [])

  return (
    <div className="mainContainer">
      <div className="dataContainer">

        <div className="header">
        👋 Hey there!
        </div>

        {!currentAccount && (
          <div className="bio">
            Wallet not connected!
          </div>
        )}

        {currentAccount && (
          <div className="bio">
            Connected Wallet: {currentAccount}
          </div>
        )}

        {currentAccount && (<div className="bio">
          Enter an NFT (ERC-721) contract address:
        </div>)}

        <input onChange={(event) => setTokenContractAddr(event.target.value)} type="text"/>

        {currentAccount && (<div className="bio">
          Enter the number of NFTs required:
        </div>)}

        <input onChange={(event) => setTokenCount(event.target.value)} type="number" />

        {/* {currentAccount && (<div className="bio">
          Enter URL to gate:
        </div>)}

        <input onChange={(event) => setCurrentURL(event.target.value)} type="text" />
         */}
        {currentAccount && (<button className="waveButton" onClick={() => checkNFT()}>
          Check if I have have enough of this NFT!
        </button>)}

        {(<button className="waveButton" onClick={() => addRule()}>
          Add a gating rule!
        </button>)}

        {currentAccount && (<div className="bio">
          Give me a hash:
        </div>)}

        <input onChange={(event) => setCurrentHash(event.target.value)} type="text"/>

        {(<button className="waveButton" onClick={() => getRule(currentHash)}>
          Get the gating rule!
        </button>)}


      </div>
    </div>
  );
}

export default App