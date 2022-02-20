import React, { useEffect, useState } from "react";
import {useParams} from "react-router-dom";
import {checkIfWalletConnected, getConnectedAccount} from "./WalletUtils";
import { ethers } from "ethers";
import {rulesContractAddr} from "./App";
import "./App.css";
import RULES_ABI from "./abi/rules.json";
import styles from './styles/Master.module.scss'

const NOT_VALIDATED = 0;
const PENDING_VALID = 1;
const CHECKING_VALID = 2;
const INVALID = 3;

const Redirect = () => {
    let { lockID } = useParams();
    console.log("lockID from URL: ", lockID);

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

        // Call "isValid" function, smart contract will verify wallet
        // address against stored rules on lock
        console.log("wallet address: ", account);
        console.log("lock ID: ", lockID);
        const res = await rulesContract.isValid(account, lockID);
        console.log("res: ", res);
        console.log("is valid: ", res[0]);
        console.log("redirect URL: ", res[1]);

        const isValid = res[0];
        const redirectURL = res[1];

        if (status == CHECKING_VALID) {
            if (isValid && redirectURL !== "") {
                window.location.assign(redirectURL);
            } else {
                setStatus(INVALID);
            }
        }
    }

    useEffect(() => {
        handleRedirect();
    })

    const unlockAccessClick = () => {
        console.log("unlock access");
        setStatus(PENDING_VALID);
        setTimeout(function () {
                setStatus(CHECKING_VALID);
        }, 5000);
        console.log("done access");
        
    }

    return (
        <div className={styles.mainContainer}>
            <div className={styles.dataContainer}>
                {status == NOT_VALIDATED && (
                    <main style={{ padding: '1rem 0' }}>
                    <h2 className={styles.header}>👋 Welcome! This URL is token-gated.</h2>
                    <div className={styles.bio}>
                        <p>We need to ensure you have the right NFTs to access this page.</p>
                        <button className={styles.waveButton} onClick={() => unlockAccessClick()}>Check Access</button>
                    </div>
                    </main>
                )}

                {status == PENDING_VALID && (
                    <main style={{ padding: '1rem 0' }}>
                    <h2 className={styles.header}>Checking if you have access...</h2>
                    </main>
                )}

                {status == INVALID && (
                    <main style={{ padding: '1rem 0' }}>
                    <h2 className={styles.header}>Oops, looks like you don't have the required NFTs! </h2>
                    <br></br>
                    <h1 className={styles.header}>🤷‍♂️</h1>
                    </main>
                )}
            </div>
        </div>
    );
}

export default Redirect