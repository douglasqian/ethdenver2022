import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import ERC20_ABI from "./abi/erc20.json";
import ERC721_ABI from "./abi/erc721.json";
import ERC1155_ABI from "./abi/erc1155.json";


const App = () => {

  // Hard coded token address
  const TOKEN_CONTRACT_ADDRESS = "0x0993f3911258759549aFCCAAD9a4e0999A8FC132";

  const { ethereum } = window;
  const [currentAccount, setCurrentAccount] = useState("");

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
      console.log("Found %d accounts, connectin to ", accounts.length, accounts[0])
      setCurrentAccount(accounts[0]);
    }
  }

  const checkNFT = async (tokenContractAddr, tokenABI) => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(tokenContractAddr, tokenABI, signer);

    try {
      const balance = await tokenContract.balanceOf(currentAccount, 0);
      console.log("Token balance: ", balance.toNumber());
    } catch (error) {
      console.log(error);
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
        
        <button className="waveButton" onClick={() => checkNFT(TOKEN_CONTRACT_ADDRESS, ERC1155_ABI)}>
          Check for NFT
        </button>

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

      </div>
    </div>
  );
}

export default App