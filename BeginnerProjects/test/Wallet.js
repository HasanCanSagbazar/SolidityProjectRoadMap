const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Wallet Contract", async function () {
    let wallet;
    let owner;
    let addr1;
    let addr2;
    let balanceBefore;

    this.beforeEach(async () => {
        [owner, addr1, addr2] = await ethers.getSigners();
        const Wallet = await ethers.getContractFactory("Wallet", owner);
        wallet = await Wallet.deploy();
        balanceBefore = await wallet.connect(addr1).getBalance();
    });

    describe("Deposit", function () {
        it("should allow users to deposit funds", async function () {
            const depositAmount = ethers.parseEther("1.0");
            await wallet.connect(addr1).deposit({ value: depositAmount });
            const balance = await wallet.connect(addr1).getBalance();
            expect(balance).to.equal(balanceBefore + depositAmount);
        });

        it("should emit a Deposit event on successful deposit", async function () {
            const depositAmount = ethers.parseEther("1.0");
            await expect(wallet.connect(addr1).deposit({ value: depositAmount }))
                .to.emit(wallet, "Deposit")
                .withArgs(addr1.address, depositAmount);
        });

        it("should reject zero deposit", async function () {
            await expect(wallet.connect(addr1).deposit({ value: 0 }))
                .to.be.revertedWith("Yatirilan miktar sifirdan buyuk olmali");
        });
    });

    describe('Withdraw', function() {  
        this.beforeEach(async () =>{
            const depositAmount = ethers.parseEther("1.0"); 
            await wallet.connect(addr1).deposit({ value: depositAmount });
            balanceBefore = await wallet.connect(addr1).getBalance();
        });

        it("should allow users to withdraw funds", async function () {
            const withdrawAmount = ethers.parseEther("0.5");
            await wallet.connect(addr1).withdraw(withdrawAmount);
            const balance = await wallet.connect(addr1).getBalance();

            expect(balance).to.equal(balanceBefore - withdrawAmount);
        });

        it("should emit a Withdraw event on successful withdraw", async function () {
            const withdrawAmount = ethers.parseEther("0.5");
            await expect(wallet.connect(addr1).withdraw(withdrawAmount))
            .to.emit(wallet, "Withdraw")
            .withArgs(addr1.address, withdrawAmount);
        });

        it("should reject zero withdraw", async function () {
            await expect(wallet.connect(addr1).withdraw(0))
            .to.be.revertedWith("Amount must be grater than zero");
        });

        it("should reject withdraw more than balance", async function () {
            const balance = await wallet.connect(addr1).getBalance();

            await expect(wallet.connect(addr1).withdraw(balance + ethers.parseEther("1.0")))
            .to.be.revertedWith("Yeterli bakiye yok");
        });
    });

    describe("Balance", function () {
        it("should get balance",async function () {
            const depositAmount = ethers.parseEther("1.0"); 
            await wallet.connect(addr1).deposit({ value: depositAmount });

            const balance = await wallet.connect(addr1).getBalance();
            expect(balance)
            .to.equal(depositAmount);
        });
    });

})

