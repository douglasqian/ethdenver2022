import React, { useEffect, useState } from "react";
import {checkIfWalletConnected, getConnectedAccount} from "./WalletUtils";
import { ethers } from "ethers";
import "./App.css";
import ERC20_ABI from "./abi/erc20.json";
import ERC721_ABI from "./abi/erc721.json";
import ERC1155_ABI from "./abi/erc1155.json";
import RULES_ABI from "./abi/rules.json";

const baseURL = "localhost:3000"
// const tokenContractAddr = "0xC5922438b8873000C11ba9866c87deFFeD15623A";

// const otherTokenContractAddr = "0xf44bb00d6bB3776df40831369c05b7368A9c916a"; // Doug wallet doesn't have NFT here
// const otherPersonAddr = "0x3cd8a9F4CE4043623b4a71ec7aBDEe77b7F3cFc0"; // this wallet does... I think it's Jakes?

export const rulesContractAddr = "0x07bfd71b4916E0a63B8Ba721C9B2C9520A94b8bF";

const App = () => {

  const { ethereum } = window;

  const [txnMining, setTxnMining] = useState(false);
  const [testMode, setTestMode] = useState(false);

  const [currentAccount, setCurrentAccount] = useState("");
  const [tokenContractAddr, setTokenContractAddr] = useState("0xC5922438b8873000C11ba9866c87deFFeD15623A");
  const [currentURL, setCurrentURL] = useState("https://i.kym-cdn.com/photos/images/original/002/127/143/594.jpg");
  const [redirectURL, setRedirectURL] = useState("");

  const createLock = async () => {
    /*
      This function creats a new lock (redirect URL + set of rules)
      and stores that in the smart contract on the backend.
    */

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
      console.log("createLock txn: ", txn);

      var lockID = await readLockCounter(rulesContract);
      lockID = lockID-1;
      const redirectURL = baseURL + "/" + lockID;
      console.log("redirect URL: ", redirectURL);
      setRedirectURL(redirectURL);

    } catch (error) {
      console.log(error);
    }
  }

  const readLockCounter = async (rulesContract) => {
    /* 
      Reads the current global lock counter from the smart contract.
    */
    const lockID = await rulesContract.getLockCounter();
    console.log("getLockCounter txn: ", lockID);
    console.log("Lock ID: ", lockID.toNumber());
    return lockID.toNumber();
  }


  const connectWalletWrapper = async () => {
    /* 
      Wrapper for connecting the wallet and setting the current wallet address.
    */
    await checkIfWalletConnected(ethereum);
    const account = await getConnectedAccount(ethereum);
    setCurrentAccount(account);
  }

  useEffect(() => {
    /* 
      This runs our function when the page loads.
    */
    connectWalletWrapper();

  }, [])

  return (
    <div className="mainContainer">
      <div className="dataContainer">

        {currentAccount && (<div className="header">
        👋 Let's create a URL!
        </div>)}

        {!currentAccount && (
          <div className="header">
            Wallet not connected!
          </div>
        )}

        {currentAccount && (<div className="bio">
          Enter an NFT (ERC-721) contract address:
        </div>)}

        <input onChange={(event) => setTokenContractAddr(event.target.value)} type="text"/>

        {currentAccount && (<div className="bio">
          Enter URL to gate:
        </div>)}

        <input onChange={(event) => setCurrentURL(event.target.value)} type="text" />
        

        {(<button className="waveButton" onClick={() => createLock()}>
          Create a new lock with rules!
        </button>)}

        {txnMining && (<div className="bio">
          <br></br>
        ⛏ Working on it...
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

      </div>
    </div>
  );
}

export default App