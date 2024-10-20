const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Custom Token", async function () {
    let CustomToken;
    let customToken;
    let owner;
    let initialSupply;
    this.beforeEach(async () => {
        [owner] = await ethers.getSigners();
        CustomToken = await ethers.getContractFactory("SilverToken", owner);
        initialSupply = "1000";
        customToken = await CustomToken.deploy(initialSupply);
    });

    it("should have correct name and symbol", async function () {
        expect(await customToken.name()).to.equal("Silver");
        expect(await customToken.symbol()).to.equal("Slv");
    });


    it("should mint initial supply to the owner", async function () {
        const ownerBalance = await customToken.balanceOf(owner.address);
        expect(ownerBalance).to.equal(initialSupply * 10 ** 6);
    })
})