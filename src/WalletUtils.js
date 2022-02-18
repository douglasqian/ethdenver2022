
export const checkIfWalletConnected = async (ethereum) => {

    // Make sure wallet is connected
    if (!ethereum) {
      alert("MetaMask wallet not connected yet! Please press the connect wallet button!");
    } else {
      console.log("We have the ethereum object", ethereum);
    }
  }

export const getConnectedAccount = async (ethereum) => {

    // Get the connected wallet's address and store it
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    if (accounts.length === 0) {
      alert("No authorized accounts found!")
    } else {
      console.log("Found %d accounts, connecting to ", accounts.length, accounts[0])
      return accounts[0];
    }
}