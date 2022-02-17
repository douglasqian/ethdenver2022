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

    function addRule(bytes32 _hash, address addr, uint count) public {
        
        rules[_hash].token_contract_address = addr;
        rules[_hash].token_count = count;
    }
}
