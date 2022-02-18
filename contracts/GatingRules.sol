//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

interface ERC721 /* is ERC165 */ {
    event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);
    event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);
    event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);
    function balanceOf(address _owner) external view returns (uint256);
    function ownerOf(uint256 _tokenId) external view returns (address);   
    function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes memory data) external payable;
    function safeTransferFrom(address _from, address _to, uint256 _tokenId) external payable;
    function transferFrom(address _from, address _to, uint256 _tokenId) external payable;
    function approve(address _approved, uint256 _tokenId) external payable;
    function setApprovalForAll(address _operator, bool _approved) external;
    function getApproved(uint256 _tokenId) external view returns (address);
    function isApprovedForAll(address _owner, address _operator) external view returns (bool);
}

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

    function createLock(string memory dest_url, RuleERC721[] memory new_rules) public payable returns (uint) {
        console.log("Creating lock");
        require(bytes(dest_url).length >= 0);
        require(new_rules.length >= 0);
        uint newLockId = lockIdCounter;
        // we cannot set lockToRules[newLockId] to new_rules because cannot assign memory to storage
        // so we have to copy the rules to a new array
        for (uint i = 0; i < new_rules.length; i++) {
            lockToRules[newLockId].push(new_rules[i]);
        }
        lockToUrl[newLockId] = dest_url;
        lockIds.push(newLockId);
        console.log("created new lock with id: ");
        lockIdCounter += 1;

        // This doesn't actually return for some reason when you wait
        // for the smart contract to return...
        // TODO understand this?
        // Improvement for frontend code would be to use this lockID directly
        // since there could be small race conditions.
        return newLockId;
    }

    // calculate how many NFTs user owns from given contract address
    function getErc721Balance(address contractAddress, address user) public view returns (uint) {
        ERC721 erc721Token= ERC721(contractAddress);
        uint balance = erc721Token.balanceOf(user);
        return balance;
    }

    // check if user passes rule (has at least one NFT from rule's contract address)
    function checkRuleErc721(RuleERC721 memory _rule, address user) public payable returns (bool) {
        address token_contract_address = _rule.token_contract_address;
        uint balance = getErc721Balance(token_contract_address, user);
        bool res = balance > 0;

        // Can't see events on polygonscan???
        // TODO understand this?
        // https://mumbai.polygonscan.com/address/0x6D32dFA341d1eC8A0b72C62313509a12F847dcC5#events
        emit ruleCheckResult(user, token_contract_address, res);
        return res;
    }

    function _fetchURL(uint lockId) private view returns (string memory) {
        return lockToUrl[lockId];
    }

    // iterate through each rule for lock and check if user passes it
    function isValid(address user, uint lockID) public payable returns (bool, string memory) {
        require(user != address(0), "User must not be null address!");
        require(lockID > 0);
        require(lockID < lockIdCounter, "Lock with this ID not created yet!");

        RuleERC721[] memory rules = lockToRules[lockID];
        for (uint i = 0; i < rules.length; i++) {
            RuleERC721 memory rule = rules[i];
            console.log("rule.token_contract_address = ", rule.token_contract_address);
            if (!checkRuleErc721(rule, user)) {
                return (false, "");
            }
        }
        string memory url = _fetchURL(lockID);
        return (true, url);
    }




    //
    // below are helper functions for debugging & run.js script
    //

    event ruleCheckResult(
        address user,
        address token_contract_address,
        bool result
    );


    // fetch ids across all locks
    function fetchAllLockIds() public view returns (uint[] memory) {
        console.log("Fetching all lock ids");
        return lockIds;
    }
    // fetch all contract addresses associated with rules across all locks
    function fetchAllRules() public view returns (address[] memory) {
        address[] memory finalRuleAddresses = new address[](10);
        uint finalRuleAddressesIndex = 0;
        for (uint i = 0; i < lockIds.length; i++) {
            uint lockId = lockIds[i];
            RuleERC721[] memory rules = lockToRules[lockId];
            for (uint j = 0; j < rules.length; j++) {
                RuleERC721 memory rule = rules[j];
                finalRuleAddresses[finalRuleAddressesIndex] = rule.token_contract_address;
                finalRuleAddressesIndex++;
            }
        }
        return finalRuleAddresses;
    }

    // returns current lock ID counter
    function getLockCounter() public view returns (uint) {
        return lockIdCounter;
    } 
}
