// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingProposal{
    
    address public chairPerson;

    struct Voter{
        bool hasVoted;
        uint votedProposal;
    }

    struct Proposal{
        bytes32 name;
        uint voteCount;
    }

    mapping(address => Voter) public voters;
    Proposal[] proposals;

    modifier onlyChairperson(){
        require(msg.sender == chairPerson, "Only chairperson can call this.");
        _;
    }

    event Voted(Voter indexed voter, uint proposal);
    event WinnerDelegate(Proposal proposal);

    constructor(bytes32[] memory proposalNames){
        chairPerson = msg.sender;

        for(uint i = 0; i < proposalNames.length; i++){
            proposals.push(Proposal({
                name : proposalNames[i],
                voteCount : 0
            }));
        }
    }

    function useVote(uint proposal) external {
        Voter storage  voter = voters[msg.sender];

        require(!voter.hasVoted, "Voter already vote!");

        voter.hasVoted = true;
        voter.votedProposal = proposal;

        proposals[proposal].voteCount++;

        emit Voted(voter, proposal);
    }

    function winnerProposal() external onlyChairperson view returns(bytes32 name){
        uint maxVote = 0;
        //uint winner = 0;
        for(uint i = 0; i < proposals.length; i++){
            if(proposals[i].voteCount > maxVote){
                maxVote = proposals[i].voteCount;
                name = proposals[i].name;
                //winner = i;
            }
        }

        //emit WinnerDelegate(proposals[winner]);
    }

    function getVoteCount(uint proposal) external view onlyChairperson returns(uint){
        return proposals[proposal].voteCount;
    }

    function getProposalName(uint index) external view returns(bytes32 name){
        return proposals[index].name;
    }

}