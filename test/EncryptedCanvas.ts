import { expect } from "chai";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";
import { FhevmType } from "@fhevm/hardhat-plugin";
import { EncryptedCanvas, EncryptedCanvas__factory } from "../types";

type Signers = {
  deployer: HardhatEthersSigner;
  alice: HardhatEthersSigner;
  bob: HardhatEthersSigner;
};

const GRID_SIZE = 16;

async function deployFixture() {
  const factory = (await ethers.getContractFactory("EncryptedCanvas")) as EncryptedCanvas__factory;
  const contract = (await factory.deploy()) as EncryptedCanvas;
  const contractAddress = await contract.getAddress();

  return { contract, contractAddress };
}

function encodeSelection(tiles: number[]): number {
  return tiles.reduce((mask, tile) => mask | (1 << (tile - 1)), 0);
}

describe("EncryptedCanvas", function () {
  let signers: Signers;
  let contract: EncryptedCanvas;
  let contractAddress: string;

  before(async function () {
    const ethSigners = await ethers.getSigners();
    signers = {
      deployer: ethSigners[0],
      alice: ethSigners[1],
      bob: ethSigners[2],
    };
  });

  beforeEach(async function () {
    if (!fhevm.isMock) {
      this.skip();
    }

    ({ contract, contractAddress } = await deployFixture());
  });

  it("registers players with empty encrypted selections", async function () {
    await expect(contract.connect(signers.alice).registerPlayer("alice")).to.emit(contract, "PlayerRegistered");

    const player = await contract.getPlayer(signers.alice.address);

    expect(player[0]).to.eq("alice");
    expect(player[1]).to.eq(true);
    expect(player[2]).to.eq(false);

    const decryptedMask = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      player[3],
      contractAddress,
      signers.alice,
    );

    expect(decryptedMask).to.eq(0);
  });

  it("prevents registration without username or twice", async function () {
    await expect(contract.connect(signers.alice).registerPlayer("")).to.be.revertedWithCustomError(
      contract,
      "UsernameRequired",
    );

    await contract.connect(signers.alice).registerPlayer("alice");

    await expect(contract.connect(signers.alice).registerPlayer("alice")).to.be.revertedWithCustomError(
      contract,
      "AlreadyRegistered",
    );
  });

  it("stores encrypted selections that decrypt correctly", async function () {
    await contract.connect(signers.alice).registerPlayer("alice");

    const tiles = [1, 4, 8, 16];
    const mask = encodeSelection(tiles);

    const encryptedInput = await fhevm
      .createEncryptedInput(contractAddress, signers.alice.address)
      .add32(mask)
      .encrypt();

    await expect(
      contract.connect(signers.alice).updateSelection(encryptedInput.handles[0], encryptedInput.inputProof),
    ).to.emit(contract, "SelectionUpdated");

    const player = await contract.getPlayer(signers.alice.address);

    expect(player[2]).to.eq(true);

    const decryptedMask = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      player[3],
      contractAddress,
      signers.alice,
    );

    expect(decryptedMask).to.eq(mask);
  });

  it("only allows registered players to update selections", async function () {
    const tiles = [2, 5];
    const mask = encodeSelection(tiles);

    const encryptedInput = await fhevm
      .createEncryptedInput(contractAddress, signers.alice.address)
      .add32(mask)
      .encrypt();

    await expect(
      contract.connect(signers.alice).updateSelection(encryptedInput.handles[0], encryptedInput.inputProof),
    ).to.be.revertedWithCustomError(contract, "NotRegistered");
  });

  it("tracks all registered addresses", async function () {
    await contract.connect(signers.alice).registerPlayer("alice");
    await contract.connect(signers.bob).registerPlayer("bob");

    const players = await contract.getRegisteredPlayers();
    expect(players).to.deep.eq([signers.alice.address, signers.bob.address]);
  });
});
