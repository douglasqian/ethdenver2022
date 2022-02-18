const main = async () => {
    const contractFactory = await hre.ethers.getContractFactory("GatingRules");
    const gatingRulesContract = await contractFactory.deploy();
    await gatingRulesContract.deployed();
    console.log("Contract deployed to:", gatingRulesContract.address);

    let lockIds;
	  lockIds = await gatingRulesContract.fetchAllLockIds();
    console.log("LockIds:", lockIds);

    let zzzzz;
	  zzzzz = await gatingRulesContract.addNewTestLock();
    zzzzz = await gatingRulesContract.addNewTestLock();
    zzzzz = await gatingRulesContract.addNewTestLock();
    // console.log("zzzzz:", zzzzz);
    console.log("testttt");

    // need to sleep to allow enough time for lock creation methods to run
    console.log("sleeping now..."); 
    await sleep(5000).then(() => {});
    console.log("done sleeping!");

    // lockIds = await gatingRulesContract.addNewLockId();

    lockIds = await gatingRulesContract.fetchAllLockIds();
    console.log("LockIds:", lockIds);

    allRules = await gatingRulesContract.fetchAllRules();
    console.log("allRules:", allRules);

    const firstLockId = lockIds[0];
    const user = "0x1111111111111111111111111111111111111111";
    isValid = await gatingRulesContract.isValid(user, firstLockId);
    console.log("isValid:", isValid);
  };

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0); // exit Node process without error
    } catch (error) {
      console.log(error);
      process.exit(1); // exit Node process while indicating 'Uncaught Fatal Exception' error
    }
    // Read more about Node exit ('process.exit(num)') status codes here: https://stackoverflow.com/a/47163396/7974948
  };
  
  runMain();