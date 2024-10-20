const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("VotingProposal", function () {
    let VotingProposal;
    let voting;
    let chairperson;
    let addr1;
    let addr2;
    let addr3;

    beforeEach(async function () {
        [chairperson, addr1, addr2, addr3] = await ethers.getSigners();

        const proposalNames = [
            "0x496e6372656173652042756467657420666f72204d61726b6574696e67000000",
            "0x446576656c6f70204e65772050726f64756374204c696e650000000000000000",
            "0x457870616e6420746f204e6577204d61726b6574730000000000000000000000",
            "0x466f637573206f6e20436f737420526564756374696f6e000000000000000000"
        ];

        VotingProposal = await ethers.getContractFactory("VotingProposal");
        voting = await VotingProposal.deploy(proposalNames);

    });

    it("should deploy and assign chairperson", async function () {
        expect(await voting.chairPerson()).to.equal(chairperson.address);
    });

    it("should allow voting and increment vote count", async function () {
        await voting.connect(addr1).useVote(0);
        const proposalVoteCount = await voting.connect(chairperson).getVoteCount(0);
        expect(proposalVoteCount).to.equal(1);
    });

    it("should not allow double voting", async function () {
        await voting.connect(addr1).useVote(0);
        await expect(voting.connect(addr1).useVote(1)).to.be.revertedWith("Voter already vote!");
    });

    it("should correctly calculate the winning proposal", async function () {
        await voting.connect(addr1).useVote(0); 
        await voting.connect(addr2).useVote(1); 
        await voting.connect(addr3).useVote(1); 
    
        const winningProposalName = await voting.connect(chairperson).winnerProposal();
        const getProposalName = await voting.connect(chairperson).getProposalName(1); 
    
        expect(winningProposalName).to.equal(getProposalName);
    });
    

    it("should only allow chairperson to get vote count and determine winner", async function () {
        await voting.connect(addr1).useVote(0);
        await expect(voting.connect(addr1).getVoteCount(0)).to.be.revertedWith("Only chairperson can call this.");

        const voteCount = await voting.connect(chairperson).getVoteCount(0);
        expect(voteCount).to.equal(1);

        await voting.connect(chairperson).winnerProposal();
    });
});
