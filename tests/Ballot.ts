import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Ballot } from "../typechain-types/Ballot";

const PROPOSALS = ["Raspberry", "Pistacchio", "Vanilla"];

describe("Ballot", async () => {
  let ballotContract: Ballot;
  let accounts: SignerWithAddress[];
  beforeEach(async () => {
    accounts = await ethers.getSigners();
    const ballotContractFactory = await ethers.getContractFactory("Ballot");
    ballotContract = await ballotContractFactory.deploy(
      PROPOSALS.map((prop) => ethers.utils.formatBytes32String(prop))
    );
    await ballotContract.deployed();
  });
  describe("When the contract is deployed", async () => {
    it("Has the provided proposals", async () => {
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.proposals(index);
        expect(ethers.utils.parseBytes32String(proposal.name)).to.eq(
          PROPOSALS[index]
        );
      }
    });
    it("Sets the deployer address as chairperson", async () => {
      const chairperson = await ballotContract.chairperson();
      expect(chairperson).to.eq(accounts[0].address);
    });
    it("Sets the voting weight for the chairperson as 1", async function () {
      const chairpersonVoter = await ballotContract.voters(accounts[0].address);
      expect(chairpersonVoter.weight).to.eq(1);
    });
  });
});
