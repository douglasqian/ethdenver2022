import React, { useEffect, useState } from "react";
import {connectWallet} from "./WalletUtils";
import { ethers } from "ethers";
import {rulesContractAddr} from "./App";
import "./App.css";
import RULES_ABI from "./abi/rules.json";

const NOT_VALIDATED = 0;
const VALID = 1;
const INVALID = 2;

const Redirect = () => {
    console.log(window.location.pathname);

    const { ethereum } = window;
    const [status, setStatus] = useState(NOT_VALIDATED);

    const setValid = async() => {
        setStatus(VALID);
    }

    const handleRedirect = async() => {

        // Connect wallet if haven't already
        await connectWallet(ethereum);

        // Initialize lock contract ethereum object
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const rulesContract = new ethers.Contract(rulesContractAddr, RULES_ABI.abi, signer);

        // Call "isValid" function, smart contract will verify wallet
        // address against stored rules on lock
        const isValid = await rulesContract.isValid("0x34f67dA4c6389a2Cfe1916Be516efF8AFf5cFb14", 1);
        console.log("res: ", isValid);

        if (isValid) {
            // Redirect to URL
            window.location.assign('https://google.com');
        }
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
            <h2>Validating...</h2>
            </main>)}

            {status == VALID && (<main style={{ padding: '1rem 0' }}>
            <h2>You're good!</h2>
            </main>)}

            {status == INVALID && (<main style={{ padding: '1rem 0' }}>
            <h2>Oops, looks like you don't have permissions</h2>
            </main>)}
        </div>
    );
}

export default Redirect