// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Wallet {
    address public owner;
    mapping(address => uint256) public balances;

    event Deposit(address indexed account, uint256 amount);
    event Withdraw(address indexed account, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Bu islem sadece owner tarafindan yapilabilir");
        _;
    }

    function deposit() public payable {
        require(msg.value > 0, "Yatirilan miktar sifirdan buyuk olmali");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 _amount) public {
        require(_amount > 0, "Amount must be grater than zero");
        require(balances[msg.sender] >= _amount, "Yeterli bakiye yok");

        balances[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);
        emit Withdraw(msg.sender, _amount);
    }

    function getBalance() public view returns (uint256) {
        return balances[msg.sender];
    }

    function transferOwner(address newOwner) public onlyOwner{
        require(newOwner != address(0), "Invalid owner address");
        require(newOwner != owner, "New owner cannot be previous owner");
        owner = newOwner;
    }

}