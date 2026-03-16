import { ethers } from "hardhat";

async function main() {
  const validatorAddress = process.env.VALIDATOR_ADDRESS;
  if (!validatorAddress) {
    throw new Error("VALIDATOR_ADDRESS not set");
  }

  const ArenaDashLedger = await ethers.getContractFactory("ArenaDashLedger");
  const ledger = await ArenaDashLedger.deploy(validatorAddress);

  await ledger.waitForDeployment();

  console.log(`ArenaDashLedger deployed to: ${await ledger.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
