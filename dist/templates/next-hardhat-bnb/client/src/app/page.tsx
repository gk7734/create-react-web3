"use client";

/**
 * Counter dApp example.
 *
 * Reads and writes the bundled `Counter` smart contract through wagmi.
 * After deploying the contract (see ../blockchain), paste its address
 * into `src/utils/contract.ts`.
 */

import { useCallback, useEffect, useMemo } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/utils/contract";

/** BNB Smart Chain testnet chain ID — change to match your deployment. */
const CHAIN_ID = 97;
/** Delay before refetching the counter after a successful write (ms). */
const REFETCH_DELAY = 2000;

export default function Home() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const {
    data: counterValue,
    isError,
    isLoading,
    error,
    refetch,
  } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "get",
    query: {
      enabled: isConnected,
      refetchOnWindowFocus: false,
      staleTime: 10000,
    },
    chainId: CHAIN_ID,
  });

  // Derive the count directly from the contract read instead of mirroring
  // it into local state — avoids an extra effect and cascading renders.
  const count = useMemo<number>(() => {
    if (counterValue === undefined || counterValue === null) return 0;
    const parsed = Number(counterValue);
    return Number.isNaN(parsed) ? 0 : parsed;
  }, [counterValue]);

  const {
    data: txHash,
    writeContract,
    error: writeError,
    isPending,
  } = useWriteContract({
    mutation: {
      onSuccess: () => {
        setTimeout(() => refetch(), REFETCH_DELAY);
      },
      onError: (err) => console.error("Transaction failed:", err),
    },
  });

  const { isSuccess: isReceiptSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
    query: { enabled: !!txHash },
  });

  const handleAction = useCallback(
    (fn: string) => async () => {
      if (!isConnected) {
        alert("Please connect your wallet first!");
        return;
      }
      try {
        await writeContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: CONTRACT_ABI,
          functionName: fn,
          chainId: CHAIN_ID,
        });
      } catch (err) {
        console.error("Transaction error:", err);
      }
    },
    [isConnected, writeContract],
  );

  useEffect(() => {
    if (isReceiptSuccess) refetch();
  }, [isReceiptSuccess, refetch]);

  const isButtonDisabled = useMemo(
    () => !isConnected || isPending,
    [isConnected, isPending],
  );

  const buttonTexts = useMemo(
    () => ({
      decrement: isPending ? "Processing..." : "Decrement (-1)",
      increment: isPending ? "Processing..." : "Increment (+1)",
      reset: isPending ? "Processing..." : "Reset (0)",
    }),
    [isPending],
  );

  if (isLoading) {
    return (
      <main className="container">
        <div>Loading contract data...</div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="container">
        <h2>Failed to load contract data</h2>
        <p>
          <strong>Error message:</strong> {error?.message || "Unknown error"}
        </p>
        <button className="btn" onClick={() => refetch()} type="button">
          Retry
        </button>
      </main>
    );
  }

  return (
    <main className="container">
      <h1>Next.js + Hardhat</h1>

      <h2 className="counter">Count: {count}</h2>

      <div className="btn-group">
        <button
          className="btn"
          onClick={handleAction("dec")}
          disabled={isButtonDisabled}
          type="button"
        >
          {buttonTexts.decrement}
        </button>

        <button
          className="btn btn-primary"
          onClick={handleAction("inc")}
          disabled={isButtonDisabled}
          type="button"
        >
          {buttonTexts.increment}
        </button>

        <button
          className="btn btn-danger"
          onClick={handleAction("reset")}
          disabled={isButtonDisabled}
          type="button"
        >
          {buttonTexts.reset}
        </button>
      </div>

      <div className="wallet">
        {isConnected ? (
          <>
            <p>Connected: {address}</p>
            <button className="btn" onClick={() => disconnect()} type="button">
              Disconnect
            </button>
          </>
        ) : (
          connectors.map((connector) => (
            <button
              className="btn"
              key={connector.id}
              onClick={() => connect({ connector })}
              type="button"
            >
              Connect with {connector.name}
            </button>
          ))
        )}
      </div>

      <details className="debug">
        <summary>Debug Info</summary>
        <div>
          <p><strong>chain Id:</strong> {chain?.id ?? "undefined"}</p>
          <p><strong>chain name:</strong> {chain?.name ?? "undefined"}</p>
          <p><strong>CONTRACT_ADDRESS:</strong> {CONTRACT_ADDRESS || "(not set)"}</p>
          <p><strong>isConnected:</strong> {isConnected.toString()}</p>
          <p><strong>counterValue:</strong> {counterValue?.toString() ?? "undefined"}</p>
          <p><strong>writeError:</strong> {writeError?.message ?? "none"}</p>
        </div>
      </details>
    </main>
  );
}
