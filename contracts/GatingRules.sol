//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract GatingRules {

    struct Rule {
        address token_contract_address;
        uint token_count;
    }

    mapping (bytes32 => Rule) public rules;

    constructor() {
        console.log("Yo im turnt up");
    }

    function fetchRule(bytes32 _hash) public view returns (Rule memory) {
        return rules[_hash];
    }

    function createLock(string calldata dest_url, Rule[] calldata new_rules) public {
        // Implement me.
        require(bytes(dest_url).length >= 0);
        require(new_rules.length >= 0);
        // rules[_hash].token_contract_address = addr;
        // rules[_hash].token_count = count;
    }

    function isValid(address user, uint lockID) public pure returns (bool) {
        // Implement me
        require(user != address(0));
        require(lockID != 0);
        return true;
    }
}
