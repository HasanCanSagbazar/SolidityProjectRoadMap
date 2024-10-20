// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;

contract Counter{
    uint256 public counter;

    constructor() {
        counter = 0;
    }

    function increment() external{
        counter += 1;
    }

    function getCurrent() external view returns(uint256){
        return counter;
    }
}