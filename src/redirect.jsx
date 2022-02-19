import React, { useEffect, useState } from "react";
import {checkIfWalletConnected, getConnectedAccount} from "./WalletUtils";
import { ethers } from "ethers";
import {rulesContractAddr} from "./App";
import "./App.css";
import RULES_ABI from "./abi/rules.json";

const NOT_VALIDATED = 0;
const VALID = 1;
const INVALID = 2;

const Redirect = () => {

    const { ethereum } = window;
    const [status, setStatus] = useState(NOT_VALIDATED);

    const handleRedirect = async() => {

        // Connect wallet if haven't already
        await checkIfWalletConnected(ethereum);
        const account = await getConnectedAccount(ethereum);

        // Initialize lock contract ethereum object
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const rulesContract = new ethers.Contract(rulesContractAddr, RULES_ABI.abi, signer);

        // drop the first character ("/")
        const lockIDFromURL = Number(window.location.pathname.substring(1));

        // Call "isValid" function, smart contract will verify wallet
        // address against stored rules on lock
        console.log("wallet address: ", account);
        console.log("lock ID: ", lockIDFromURL);
        const res = await rulesContract.isValid(account, lockIDFromURL);
        console.log("res: ", res);
        console.log("is valid: ", res[0]);
        console.log("redirect URL: ", res[1]);

        const isValid = res[0];
        const redirectURL = res[1];

        if (isValid && redirectURL !== "") {
            window.location.assign(redirectURL);
        } else {
            setStatus(INVALID);
        }
    }

    useEffect(() => {
        handleRedirect();
    })

    return (
        <div>

            {status == NOT_VALIDATED && (<main style={{ padding: '1rem 0' }}>
            <h2 className="header">Checking if you have the NFT...</h2>
            </main>)}

            {status == INVALID && (<main style={{ padding: '1rem 0' }}>
            <h2 className="header">Oops, looks like you don't have the NFT! </h2>
            <br></br>
            <h1 className="header">🤷‍♂️</h1>
            </main>)}
        </div>
    );
}

export default Redirect