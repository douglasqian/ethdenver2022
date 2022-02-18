import React, { useEffect, useState } from "react";
import {connectWallet} from "./WalletUtils";
import { ethers } from "ethers";
import "./App.css";
import ERC20_ABI from "./abi/erc20.json";
import ERC721_ABI from "./abi/erc721.json";
import ERC1155_ABI from "./abi/erc1155.json";
import RULES_ABI from "./abi/rules.json";

const baseURL = "localhost:3000"
// const tokenContractAddr = "0xC5922438b8873000C11ba9866c87deFFeD15623A"
export const rulesContractAddr = "0x2069669cCA7bd7875927D0b3EE8d665D193d5ECe";

const App = () => {

  const { ethereum } = window;

  const [txnMining, setTxnMining] = useState(false);
  const [testMode, setTestMode] = useState(false);

  const [currentAccount, setCurrentAccount] = useState("");
  const [tokenContractAddr, setTokenContractAddr] = useState("0xC5922438b8873000C11ba9866c87deFFeD15623A");
  const [tokenCount, setTokenCount] = useState(1);
  const [currentURL, setCurrentURL] = useState("https://i.kym-cdn.com/photos/images/original/002/127/143/594.jpg");
  const [redirectURL, setRedirectURL] = useState("");

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

  const readLockCounter = async (rulesContract) => {
    const lockID = await rulesContract.getLockCounter();
    console.log("Lock ID: ", lockID.toNumber());
    return lockID.toNumber();
  }

  const createLock = async () => {
    /*
      This function adds a new rule (token contract address, token count) to
      that is indexed by a hash to the smart contract's data structure.
    */

    console.log("tokenContractAddr: ", tokenContractAddr);

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const rulesContract = new ethers.Contract(rulesContractAddr, RULES_ABI.abi, signer);

    try {
      const txn = await rulesContract.createLock(currentURL, [{token_contract_address: tokenContractAddr}]);
      console.log("Txn mining...");
      
      setTxnMining(true);
      await txn.wait();
      setTxnMining(false);

      console.log("Txn mined!");

      const lockID = await readLockCounter(rulesContract);
      const redirectURL = baseURL + "/" + lockID;
      console.log("redirect URL: ", redirectURL);
      setRedirectURL(redirectURL);

    } catch (error) {
      console.log(error);
    }
  }

  const getRule = async (_hash) => {
    /*
      @dev TEST FUNCTION
      This function retrieves a rule from the smart contract given a hash in
      the redirect URL.
    */
    const hash = ethers.utils.hexZeroPad("0x133", 32);
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

  const connectWalletWrapper = async () => {
    const account = await connectWallet(ethereum);
    setCurrentAccount(account);
  }

  /*
  * This runs our function when the page loads.
  */
  useEffect(() => {
    connectWalletWrapper();
    console.log("gating rules contract addr: ", process.env.REACT_APP_GATING_RULES_CONTRACT_ADDRESS);
    // setRulesContractAddr(process.env.REACT_APP_GATING_RULES_CONTRACT_ADDRESS);
    // console.log("gating rules contract addr 2: ", rulesContractAddr);
  }, [])

  return (
    <div className="mainContainer">
      <div className="dataContainer">

        <div className="header">
        👋 Let's create a URL!
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

        {/* {currentAccount && (<div className="bio">
          Enter the number of NFTs required:
        </div>)}

        <input onChange={(event) => setTokenCount(event.target.value)} type="number" /> */}

        {currentAccount && (<div className="bio">
          Enter URL to gate:
        </div>)}

        <input onChange={(event) => setCurrentURL(event.target.value)} type="text" />
        

        {(<button className="waveButton" onClick={() => createLock()}>
          Create a new lock with rules!
        </button>)}

        {txnMining && (<div className="bio">
          <br></br>
        ⛏ Transaction mining...
        </div>)}

        {redirectURL && (<div className="bio">
          Here's your URL 🎉
          <br></br>
          <br></br>
          {redirectURL}
          <br></br>
          <br></br>
          Share it with some friends!
        </div>)}

        <br></br>
        <br></br>
        <br></br>

        <button onClick={() => setTestMode(!testMode)}>
          Toggle test mode
        </button>

        {testMode && (<h2 className="header"> For testing purposes only: </h2>)}

        {testMode && (<button className="waveButton" onClick={() => checkNFT()}>
          Check if I have have enough of this NFT!
        </button>)}

        {/* {currentAccount && (<div className="bio">
          Give me a hash:
        </div>)}

        <input onChange={(event) => setCurrentHash(event.target.value)} type="text"/>

        {(<button className="waveButton" onClick={() => getRule(currentHash)}>
          Get the gating rule!
        </button>)} */}


      </div>
    </div>
  );
}

export default App