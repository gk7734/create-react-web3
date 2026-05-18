"use client";

/**
 * XRP Ledger counter example.
 *
 * Connects to the XRPL testnet, funds a freshly generated wallet, and
 * stores the counter value inside transaction memos. The xrpl client is
 * created inside an effect so it only ever runs in the browser.
 */

import { useEffect, useRef, useState } from "react";
import { Wallet, Client, type SubmittableTransaction } from "xrpl";
import { Buffer } from "buffer";

const TESTNET_URL = "wss://s.altnet.rippletest.net:51233";

export default function Home() {
  const clientRef = useRef<Client | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [count, setCount] = useState(0);
  const [writeError, setWriteError] = useState<Error | null>(null);

  useEffect(() => {
    const client = new Client(TESTNET_URL);
    clientRef.current = client;

    async function init() {
      try {
        await client.connect();
        setIsConnected(true);

        const w = Wallet.generate();
        setWallet(w);

        await client.fundWallet(w);
      } catch (err) {
        console.error(err);
      }
    }

    init();

    return () => {
      client.disconnect();
      clientRef.current = null;
    };
  }, []);

  const handleAction = (action: "inc" | "dec" | "reset") => async () => {
    const client = clientRef.current;
    if (!wallet || !client || isPending) return;
    if (!client.isConnected()) await client.connect();

    let newCount = count;
    if (action === "inc") newCount += 1;
    if (action === "dec") newCount -= 1;
    if (action === "reset") newCount = 0;

    setIsPending(true);
    setWriteError(null);

    try {
      const tx = {
        TransactionType: "Payment",
        Account: wallet.address,
        Destination: "rJpSHVUJJERFFWAZww362sGtVNJDKdgweN",
        Amount: "1000",
        Memos: [
          {
            Memo: {
              MemoType: Buffer.from("count").toString("hex"),
              MemoData: Buffer.from(newCount.toString()).toString("hex"),
            },
          },
        ],
      } as SubmittableTransaction;

      const prepared = await client.autofill(tx);
      const signed = wallet.sign(prepared);
      await client.submitAndWait(signed.tx_blob);

      setCount(newCount);
    } catch (err) {
      console.error(err);
      setWriteError(err instanceof Error ? err : new Error(String(err)));
    }

    setIsPending(false);
  };

  return (
    <main className="container">
      <h1>Next.js + xrpl.js</h1>

      <h2 className="counter">Count: {count}</h2>

      <div className="btn-group">
        <button
          className="btn"
          onClick={handleAction("dec")}
          disabled={!isConnected || isPending}
          type="button"
        >
          {isPending ? "Processing..." : "Decrement (-1)"}
        </button>

        <button
          className="btn btn-primary"
          onClick={handleAction("inc")}
          disabled={!isConnected || isPending}
          type="button"
        >
          {isPending ? "Processing..." : "Increment (+1)"}
        </button>

        <button
          className="btn btn-danger"
          onClick={handleAction("reset")}
          disabled={!isConnected || isPending}
          type="button"
        >
          {isPending ? "Processing..." : "Reset (0)"}
        </button>
      </div>

      <details className="debug">
        <summary>Debug Info</summary>
        <div>
          <p><strong>isConnected:</strong> {isConnected.toString()}</p>
          <p><strong>isPending:</strong> {isPending.toString()}</p>
          <p><strong>Wallet Address:</strong> {wallet?.address ?? "-"}</p>
          <p><strong>Current Count:</strong> {count}</p>
          <p><strong>Write Error:</strong> {writeError?.message ?? "none"}</p>
        </div>
      </details>
    </main>
  );
}
