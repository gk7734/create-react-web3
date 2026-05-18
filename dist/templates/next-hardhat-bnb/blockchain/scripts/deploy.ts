import { network } from "hardhat";

const { viem } = await network.connect();

const contract = await viem.deployContract("Counter");

await contract.write.inc();
console.log("Counter value:", await contract.read.x());
console.log("Contract deployed at:", contract.address);
