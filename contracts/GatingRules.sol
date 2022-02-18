//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract GatingRules {
    uint lockIdCounter = 1;
    mapping (uint => RuleERC721[]) public lockToRules;
    mapping (uint => string) public lockToUrl;
    uint[] public lockIds;

    struct RuleERC721 {
        address token_contract_address;
    }

     struct RuleERC20 {
        address token_contract_address;
        uint token_count;
    }

    constructor() {
        console.log("Yo im turnt up");
    }

    function createLock(string memory dest_url, RuleERC721[] memory new_rules) public returns (uint) {
        console.log("Creating lock");
        require(bytes(dest_url).length >= 0);
        require(new_rules.length >= 0);
        uint newLockId = lockIdCounter;
        // we cannot set lockToRules[newLockId] to new_rules because cannot assign memory to storage
        for (uint i = 0; i < new_rules.length; i++) {
            lockToRules[newLockId].push(new_rules[i]);
        }
        lockToUrl[newLockId] = dest_url;
        lockIds.push(newLockId);
        console.log("created new lock with id: ", newLockId);
        lockIdCounter += 1;
        return newLockId;
    }

    function checkRuleERC721(RuleERC721 memory _rule, address user) public returns (bool) {
        // TODO: check if user has token
        // return _rule.token_contract_address.balanceOf(user) > 0;
        return true;
    }

    function _fetchURL(uint lockId) private view returns (string memory) {
        return lockToUrl[lockId];
    }

    // ensure user passes all gating rules for given lock
    function isValid(address user, uint lockID) public returns (bool, string memory) {
        require(user != address(0));
        require(lockID != 0);
        RuleERC721[] memory rules = lockToRules[lockID];
        for (uint i = 0; i < rules.length; i++) {
            RuleERC721 memory rule = rules[i];
            console.log("rule.token_contract_address = ", rule.token_contract_address);
            if (!checkRuleERC721(rule, user)) {
                return (false, "");
            }
        }
        string memory url = _fetchURL(lockID);
        return (true, url);
    }




    //
    // these are extra functions for debugging & run.js script
    //

    function fetchAllLockIds() public view returns (uint[] memory) {
        console.log("Fetching all lock ids");
        return lockIds;
    }

    function fetchAllRules() public view returns (address[] memory) {
        address[] memory finalRuleAddresses = new address[](10);
        uint finalRuleAddressesIndex = 0;
        for (uint i = 0; i < lockIds.length; i++) {
            uint lockId = lockIds[i];
            RuleERC721[] memory rules = lockToRules[lockId];
            for (uint i = 0; i < rules.length; i++) {
                RuleERC721 memory rule = rules[i];
                finalRuleAddresses[finalRuleAddressesIndex] = rule.token_contract_address;
                finalRuleAddressesIndex++;
            }
        }
        return finalRuleAddresses;
    }

    function addNewLockId() public returns (uint[] memory) {
        lockIds.push(444);
        lockIds.push(14444522222);
        return lockIds;
    }

    function addNewTestLock() public returns (uint) {
        RuleERC721[] memory new_rules = new RuleERC721[](2);
        RuleERC721 memory rule1 = RuleERC721(0x1111111111111111111111111111111111111111);
        RuleERC721 memory rule2 = RuleERC721(0x2222222222222222222222222222222222222222);
        new_rules[0] = rule1;
        new_rules[1] = rule2;
        uint newLockId = createLock("https://google.com", new_rules);
        return newLockId;
    }
}
