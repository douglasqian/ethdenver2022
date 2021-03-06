const main = async () => {
    const contractFactory = await hre.ethers.getContractFactory("GatingRules");
    const gatingRulesContract = await contractFactory.deploy();
    await gatingRulesContract.deployed();
    console.log("Contract deployed to:", gatingRulesContract.address);
  };
  
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