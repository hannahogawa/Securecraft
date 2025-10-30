import { expect } from "chai";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm, deployments } from "hardhat";
import { FhevmType } from "@fhevm/hardhat-plugin";
import { EncryptedCanvas } from "../types";

type Signers = {
  alice: HardhatEthersSigner;
};

describe("EncryptedCanvasSepolia", function () {
  let signer: Signers["alice"];
  let contract: EncryptedCanvas;
  let contractAddress: string;
  let step = 0;
  const steps = 6;

  function progress(message: string) {
    console.log(`${++step}/${steps} ${message}`);
  }

  before(async function () {
    if (fhevm.isMock) {
      this.skip();
    }

    try {
      const deployment = await deployments.get("EncryptedCanvas");
      contractAddress = deployment.address;
      contract = await ethers.getContractAt("EncryptedCanvas", deployment.address);
    } catch (error) {
      (error as Error).message += ". Call 'npx hardhat deploy --network sepolia'";
      throw error;
    }

    const signers = await ethers.getSigners();
    signer = signers[0];
  });

  it("registers if needed and updates encrypted selection", async function () {
    this.timeout(5 * 60000);

    await fhevm.initializeCLIApi();

    progress("Checking registration status...");
    const player = await contract.getPlayer(await signer.getAddress());
    if (!player[1]) {
      progress("Registering player...");
      const registerTx = await contract.connect(signer).registerPlayer("sepolia-player");
      await registerTx.wait();
    }

    progress("Encrypting selection bitmask...");
    const encryptedSelection = await fhevm
      .createEncryptedInput(contractAddress, await signer.getAddress())
      .add32(0b10101)
      .encrypt();

    progress("Submitting encrypted selection...");
    const tx = await contract
      .connect(signer)
      .updateSelection(encryptedSelection.handles[0], encryptedSelection.inputProof);
    await tx.wait();

    progress("Fetching stored encrypted selection...");
    const updatedPlayer = await contract.getPlayer(await signer.getAddress());
    expect(updatedPlayer[2]).to.eq(true);

    progress("Decrypting selection...");
    const mask = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      updatedPlayer[3],
      contractAddress,
      signer,
    );

    expect(mask).to.eq(0b10101);
  });
});
