import React, { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuid4 } from 'uuid';
import { ethers } from "ethers";
import {checkIfWalletConnected, getConnectedAccount} from "./WalletUtils";
import RULES_ABI from "./abi/rules.json";
import {add} from './ruleSlice';
import Rule from "./Rule";
import "./App.css";
import styles from './styles/Master.module.scss'

import ERC20_ABI from "./abi/erc20.json";
import ERC721_ABI from "./abi/erc721.json";
import ERC1155_ABI from "./abi/erc1155.json";

// const tokenContractAddr = "0xC5922438b8873000C11ba9866c87deFFeD15623A";

// const otherTokenContractAddr = "0xf44bb00d6bB3776df40831369c05b7368A9c916a"; // Doug wallet doesn't have NFT here
// const otherPersonAddr = "0x3cd8a9F4CE4043623b4a71ec7aBDEe77b7F3cFc0"; // this wallet does... I think it's Jakes?

export const rulesContractAddr = "0x07bfd71b4916E0a63B8Ba721C9B2C9520A94b8bF";

const App = () => {

  const { ethereum } = window;

  const [txnMining, setTxnMining] = useState(false);
  const [testMode, setTestMode] = useState(false);

  const [currentAccount, setCurrentAccount] = useState("");
  const [inputERC721Addr, setInputERC721Addr] = useState("");
  const [currentURL, setCurrentURL] = useState("https://i.kym-cdn.com/photos/images/original/002/127/143/594.jpg");
  const [redirectURL, setRedirectURL] = useState("");

  // Initializes "rules" state in Redux.
  const rules = useSelector((state) => state.rules.value)
  const dispatch = useDispatch()

  const createLock = async () => {
    /*
      This function creats a new lock (redirect URL + set of rules)
      and stores that in the smart contract on the backend.
    */

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const rulesContract = new ethers.Contract(rulesContractAddr, RULES_ABI.abi, signer);

    try {

      const inputRules = rules.map(rule =>
        ({token_contract_address: rule.tokenContractAddr}))

      const txn = await rulesContract.createLock(currentURL, inputRules);
      console.log("Txn mining...");
      
      setTxnMining(true);
      await txn.wait();
      setTxnMining(false);

      console.log("Txn mined!");
      console.log("createLock txn: ", txn);

      var lockID = await readLockCounter(rulesContract);
      lockID = lockID-1;
      const baseURL = window.location.hostname
      const redirectURL = baseURL + "/" + lockID;
      console.log("redirect URL: ", redirectURL);
      setRedirectURL(redirectURL);

    } catch (error) {
      console.log(error);
    }
  }

  const addRuleInternal = () => {
    /*
      Adds a rule to react state for repeated list rendering.
    */
    dispatch(add({id: uuid4(), tokenContractAddr: inputERC721Addr}))
    setInputERC721Addr("");
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

  const rulesComponents = rules.map((rule) => (
    <Rule
      key={rule.id}
      id={rule.id}
      tokenContractAddr={rule.tokenContractAddr}
    />
  ))

  return (
      <div className={styles.mainContainer}>
        <div className={styles.dataContainer}>

          <img style={{width:'100px', marginRight:'auto', marginLeft:'auto'}} src="/gatr.svg" alt="" />
          {currentAccount && (<div className={styles.header}>
          <p>👋 Welcome to GATR <br /> Let's create a token-gated URL!</p>
          </div>)}

          {currentAccount && (
            <div className={styles.header2}>

              <span className={styles.spanPadding}>Define set of rules that visiting wallet needs to satisfy in order to access URL.</span>

              {/* <span className={styles.spanPadding}>1. Set destination URL that you want users to access</span>
              <br />
              <span className={styles.spanPadding}>2. Define set of rules (Ex. has NFT in wallet)</span>
              <br />
              <span className={styles.spanPadding}>Only wallets that satisfy every rule can access URL.</span> */}

              {/* <p>Define set of rules that given wallet needs to pass. </p>
              <p>Each rule defines an NFT to check for on the wallet.</p>
              <p>Only wallets that satisfy every rule will allowed to access your destination URL.</p> */}
            </div>)
          }

          {!currentAccount && (
              <h1>Wallet not connected!</h1>
          )}

          <div className={styles.bio} style={{'background-color': 'rgba(0,0,0,.1)', 'margin': '10px 100px', 'border-radius':'10px'}}>
          {/* <div className={styles.sectionBackdrop}> */}
            {currentAccount && (
              <div className={styles.bio}>
                <h2 className={styles.noMargin}>1. Set Destination URL:</h2>
              </div>
            )}

            <input style={{'margin': '20px 10px'}} onChange={(event) => setCurrentURL(event.target.value)} type="text" placeholder="Destination URL here" />
          </div>

          <div className={styles.bio} style={{'background-color': 'rgba(0,0,0,.1)', 'margin': '10px 100px', 'border-radius':'10px'}}>
          {/* <div style={{'background-color': 'rgba(0,0,0,.1)', 'margin': '0px 100px'}} className={styles.bio}> */}
          {currentAccount && (
            <div className={styles.bio}>
              <h2 className={styles.noMargin}>2. Define Gating Rules</h2>
            </div>
          )}

          {rules.length !== 0 && (
            <div className={styles.bio}>
            <h3>Added Rules</h3>
            {rulesComponents}
            </div>
          )}
 
          {currentAccount && (<div className={styles.bio}>
            <p><strong>NFT (ERC-721) contract address:</strong></p>
          </div>)}

          <input value={inputERC721Addr} onChange={(event) => setInputERC721Addr(event.target.value)} type="text" placeholder="Contract Address here"/>
          <br />
          <button className={styles.waveButton} style={{'margin': '20px 10px'}} onClick={() => addRuleInternal()}>Add rule</button>
          </div>
          <br />
          {(<button style={{'width': '300px'}} className={styles.waveButton} onClick={() => createLock()}>
            Generate Token-gated URL
          </button>)}

          {txnMining && (<div className={styles.bio}>
          ⛏<p>Working on it...</p>
          </div>)}

          {!txnMining && redirectURL && (<div className={styles.bio}>
            <p>Here's your URL 🎉
            <br></br>
            {redirectURL}
            <br></br>
            Share it with some friends!</p>
          </div>)}

        </div>
      </div>
  );
}

export default App