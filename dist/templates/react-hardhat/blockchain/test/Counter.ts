// We don't have Ethereum specific assertions in Hardhat 3 yet
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { network } from "hardhat";

describe("Counter", async function () {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();

  it("Should emit Increment event when calling inc()", async function () {
    const counter = await viem.deployContract("Counter");

    await viem.assertions.emitWithArgs(
        counter.write.inc(),
        counter,
        "Increment",
        [1n],
    );
  });

  it("The sum of Increment events should match the current value", async function () {
    const counter = await viem.deployContract("Counter");
    const deploymentBlockNumber = await publicClient.getBlockNumber();

    // run a series of increments
    for (let i = 1n; i <= 10n; i++) {
      await counter.write.incBy([i]);
    }

    const events = await publicClient.getContractEvents({
      address: counter.address,
      abi: counter.abi,
      eventName: "Increment",
      fromBlock: deploymentBlockNumber,
      strict: true,
    });

    let total = 0n;
    for (const event of events) {
      total += event.args.by;
    }

    assert.equal(total, await counter.read.x());
  });

  it("Should decrement correctly with dec() and emit event", async function () {
    const counter = await viem.deployContract("Counter");

    await counter.write.inc(); // x = 1

    await viem.assertions.emitWithArgs(
        counter.write.dec(),
        counter,
        "Decrement",
        [1n],
    );

    assert.equal(await counter.read.x(), 0n);
  });

  it("Should revert dec() when counter is already zero", async function () {
    const counter = await viem.deployContract("Counter");

    await assert.rejects(counter.write.dec(), {
      message: /dec: counter is already zero/,
    });
  });

  it("Should decrement correctly with decBy()", async function () {
    const counter = await viem.deployContract("Counter");

    await counter.write.incBy([5n]); // x = 5
    await counter.write.decBy([3n]); // x should be 2

    assert.equal(await counter.read.x(), 2n);
  });

  it("Should revert decBy() with invalid values", async function () {
    const counter = await viem.deployContract("Counter");

    await counter.write.incBy([5n]);

    // case 1: by == 0
    await assert.rejects(counter.write.decBy([0n]), {
      message: /decBy: decrement should be positive/,
    });

    // case 2: decrement too large
    await assert.rejects(counter.write.decBy([10n]), {
      message: /decBy: decrement too large/,
    });
  });

  it("Should reset counter to 0 and emit Reset event", async function () {
    const counter = await viem.deployContract("Counter");

    await counter.write.incBy([7n]);
    assert.equal(await counter.read.x(), 7n);

    await viem.assertions.emit(counter.write.reset(), counter, "Reset");

    assert.equal(await counter.read.x(), 0n);
  });
});
