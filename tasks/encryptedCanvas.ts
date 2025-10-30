import { FhevmType } from "@fhevm/hardhat-plugin";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

const GRID_SIZE = 16;

function parseTiles(input: string): number[] {
  return input
    .split(",")
    .map((value) => value.trim())
    .filter((value) => value.length > 0)
    .map((value) => {
      const tile = Number(value);
      if (!Number.isInteger(tile) || tile < 1 || tile > GRID_SIZE) {
        throw new Error(`Tile value '${value}' is invalid. Tiles must be between 1 and ${GRID_SIZE}.`);
      }
      return tile;
    });
}

function encodeSelection(tiles: number[]): number {
  return tiles.reduce((mask, tile) => mask | (1 << (tile - 1)), 0);
}

task("canvas:address", "Prints the EncryptedCanvas deployment address").setAction(
  async (_taskArguments: TaskArguments, hre) => {
    const { deployments } = hre;

    const canvasDeployment = await deployments.get("EncryptedCanvas");

    console.log("EncryptedCanvas address:", canvasDeployment.address);
  },
);

task("canvas:register", "Registers the connected account with a username")
  .addParam("username", "Username to register on the canvas")
  .addOptionalParam("address", "Optionally specify the EncryptedCanvas contract address")
  .setAction(async (taskArguments: TaskArguments, hre) => {
    const { ethers, deployments } = hre;

    const contractDeployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("EncryptedCanvas");

    const [signer] = await ethers.getSigners();

    const contract = await ethers.getContractAt("EncryptedCanvas", contractDeployment.address);

    const tx = await contract.connect(signer).registerPlayer(taskArguments.username);
    console.log(`Waiting for tx: ${tx.hash}...`);
    const receipt = await tx.wait();
    console.log(`registerPlayer(${taskArguments.username}) status: ${receipt?.status}`);
  });

task("canvas:update-selection", "Encrypts and stores a grid selection")
  .addParam("tiles", "Comma-separated tile numbers between 1 and 16")
  .addOptionalParam("address", "Optionally specify the EncryptedCanvas contract address")
  .setAction(async (taskArguments: TaskArguments, hre) => {
    const { ethers, deployments, fhevm } = hre;

    const tiles = parseTiles(taskArguments.tiles);
    const mask = encodeSelection(tiles);

    await fhevm.initializeCLIApi();

    const contractDeployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("EncryptedCanvas");

    const [signer] = await ethers.getSigners();

    const encryptedInput = await fhevm
      .createEncryptedInput(contractDeployment.address, signer.address)
      .add32(mask)
      .encrypt();

    const contract = await ethers.getContractAt("EncryptedCanvas", contractDeployment.address);

    const tx = await contract
      .connect(signer)
      .updateSelection(encryptedInput.handles[0], encryptedInput.inputProof);

    console.log(`Waiting for tx: ${tx.hash}...`);
    const receipt = await tx.wait();
    console.log(`updateSelection(${tiles.join(",")}) status: ${receipt?.status}`);
  });

task("canvas:decrypt-selection", "Decrypts the stored selection for the connected account")
  .addOptionalParam("address", "Optionally specify the EncryptedCanvas contract address")
  .setAction(async (taskArguments: TaskArguments, hre) => {
    const { ethers, deployments, fhevm } = hre;

    await fhevm.initializeCLIApi();

    const contractDeployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("EncryptedCanvas");

    const [signer] = await ethers.getSigners();

    const contract = await ethers.getContractAt("EncryptedCanvas", contractDeployment.address);

    const playerData = await contract.getPlayer(signer.address);
    const encryptedSelection = playerData[3];

    if (encryptedSelection === ethers.ZeroHash) {
      console.log("No selection stored yet.");
      return;
    }

    const selection = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encryptedSelection,
      contractDeployment.address,
      signer,
    );

    console.log(`Decrypted selection bitmask: ${selection}`);
  });
