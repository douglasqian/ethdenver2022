import React, { useEffect, useState } from "react";
import "./App.css";

const NOT_VALIDATED = 0;
const VALID = 1;
const INVALID = 2;

const Redirect = () => {
    console.log(window.location.pathname);

    const [status, setStatus] = useState(NOT_VALIDATED);

    const validate = async() => {
        // Make sure wallet is connected
        // Initialize lock contract ethereum object
        // Call "isValid" function
        setStatus(VALID);
        console.log("A");
        return
    }

    const handleRedirect = async() => {
        // window.location.assign('https://google.com');

        await validate();

        console.log("B");

        console.log("status: ", status);
        switch(status) {
            case NOT_VALIDATED:
                alert("UNEXPECTED: status should have resolved!");
                break;

            case VALID:
                // return (<Redirect to="https://google.com" />);
                break;
        }

    }

    useEffect(() => {
        // handleRedirect();
    })

    return (
        <div>
            <button className="waveButton" onClick={() => handleRedirect()}>
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