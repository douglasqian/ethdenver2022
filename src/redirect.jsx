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

    const setValid = async() => {
        setStatus(VALID);
    }

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

        // if (isValid) {
            // Redirect to URL
            // window.location.assign('https://google.com');
        // }
    }

    useEffect(() => {
        handleRedirect();
    })

    return (
        <div>
            <button className="waveButton" onClick={() => setValid()}>
            Push to validate!
            </button>

            {status == NOT_VALIDATED && (<main style={{ padding: '1rem 0' }}>
            <h2 className="header">Validating...</h2>
            </main>)}

            {status == VALID && (<main style={{ padding: '1rem 0' }}>
            <h2 className="header">You're good!</h2>
            </main>)}

            {status == INVALID && (<main style={{ padding: '1rem 0' }}>
            <h2 className="header">Oops, looks like you don't have permissions</h2>
            </main>)}
        </div>
    );
}

export default Redirect