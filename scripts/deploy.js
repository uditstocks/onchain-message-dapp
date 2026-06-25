const hre = require("hardhat");

async function main() {
  const MessageStore = await hre.ethers.getContractFactory("MessageStore");
  const messageStore = await MessageStore.deploy();
  await messageStore.waitForDeployment();

  const address = await messageStore.getAddress();
  console.log("MessageStore deployed to:", address);
  console.log("\nPaste this into frontend/.env as:");
  console.log(`VITE_CONTRACT_ADDRESS=${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
