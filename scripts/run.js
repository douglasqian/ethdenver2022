const main = async () => {
    const contractFactory = await hre.ethers.getContractFactory("GatingRules");
    const gatingRulesContract = await contractFactory.deploy();
    await gatingRulesContract.deployed();
    console.log("Contract deployed to:", gatingRulesContract.address);

    let lockIds;
	  lockIds = await gatingRulesContract.fetchAllLockIds();
    console.log("LockIds:", lockIds);

    //
    // create a lock with three rules
    // confirm works as expected
    //

    // Kishan's wallet
    const user = "0xE8e46bc281FaAF366cB3dFceD376503345CB6540";
    // Kishan has 3 NFTs on this contract
    const KPmumbaiNFTContract = "0x27EA91bf719aB1b15B47A0329bBdbf807394323B";
    const rule1 = {'token_contract_address' : KPmumbaiNFTContract}
    // Kishan has 1 NFT on this contract
    const mumbai4dayzNFTContract = "0x955A68bfcb5fED96969d3e9E39507184A76a294c";
    const rule2 = {'token_contract_address' : mumbai4dayzNFTContract}
    // Kishan has 0 NFTs on this contract
    const emptyCollectionNFTContract = "0x5bcD0B2658E35609eBC38D456693A39BEF0bFc9c";
    const rule3 = {'token_contract_address' : emptyCollectionNFTContract}

    // set url & rules for lock
    const url = "twitter.com";
    const new_rules = [rule1, rule2, rule3];
    // create lock with these rules
    await gatingRulesContract.createLock(url, new_rules);
    
    // need to wait for lock creation methods to run
    console.log("sleeping now..."); 
    await sleep(5000).then(() => {});
    console.log("done sleeping!");

    // fetch all locks & all rules to confirm creation
    lockIds = await gatingRulesContract.fetchAllLockIds();
    console.log("LockIds:", lockIds);
    allRules = await gatingRulesContract.fetchAllRules();
    console.log("allRules:", allRules);

    // check # of NFTs Kishan has for each contract
    let nftBalance;
	  nftBalance = await gatingRulesContract.getErc721Balance(KPmumbaiNFTContract, user);
    console.log("KPmumbaiNFTContract: ", nftBalance); // 3
    nftBalance = await gatingRulesContract.getErc721Balance(mumbai4dayzNFTContract, user);
    console.log("mumbai4dayzNFTContract: ", nftBalance); // 1
    nftBalance = await gatingRulesContract.getErc721Balance(emptyCollectionNFTContract, user);
    console.log("emptyCollectionNFTContract: ", nftBalance); // 0

    // see the results for whether user passes each rule
    let isSuccessful;
    isSuccessful = await gatingRulesContract.checkRuleErc721(rule1, user);
    console.log("isSuccessful:", isSuccessful); // should pass
    isSuccessful = await gatingRulesContract.checkRuleErc721(rule2, user);
    console.log("isSuccessful:", isSuccessful); // should pass
    isSuccessful = await gatingRulesContract.checkRuleErc721(rule3, user);
    console.log("isSuccessful:", isSuccessful); // should fail
  
    // with lock, check if user passes all rules
    // should not pass when rule 3 is included and should pass w/o rule 3
    const firstLockId = lockIds[0];
    console.log("firstLockId:", firstLockId);
    isValid = await gatingRulesContract.isValid(user, firstLockId);
    console.log("isValid:", isValid); // false, since rule 3 will fail
    
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