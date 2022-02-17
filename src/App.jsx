import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import ERC20_ABI from "./abi/erc20.json";
import ERC721_ABI from "./abi/erc721.json";
import ERC1155_ABI from "./abi/erc1155.json";


const App = () => {

  // const [addres, setAddress] =useState()

  // Hard coded token address
  // const TOKEN_CONTRACT_ADDRESS = "0x0993f3911258759549aFCCAAD9a4e0999A8FC132";

  const { ethereum } = window;
  const [currentAccount, setCurrentAccount] = useState("");
  const [currentTokenAddr, setCurrentTokenAddr] = useState("");
  const [currentTokenCount, setCurrentTokenCount] = useState(1);

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
    const tokenContract = new ethers.Contract(currentTokenAddr, ERC721_ABI, signer);

    try {
      console.log("Checking for tokens on ", currentTokenAddr);
      const balance = await tokenContract.balanceOf(currentAccount);
      const numTokens = balance.toNumber();

      if (numTokens < currentTokenCount) {
        alert("Not enough tokens, you only have " + numTokens);
      } else {
        alert("Woohoo! You're all good!");
      }

    } catch (error) {
      console.log(error);
      alert("No tokens found! Make sure this is a valid ERC-721 token contract address");
    }
  }

  /*
  * This runs our function when the page loads.
  */
  useEffect(() => {
    connectWallet();
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

        <input onChange={(event) => setCurrentTokenAddr(event.target.value)} type="text"/>

        {currentAccount && (<div className="bio">
          Enter the number of NFTs required:
        </div>)}

        <input onChange={(event) => setCurrentTokenCount(event.target.value)} type="number" />
        
        {(<button className="waveButton" onClick={() => checkNFT()}>
          Check if I have have enough of this NFT!
        </button>)}


      </div>
    </div>
  );
}

export default App