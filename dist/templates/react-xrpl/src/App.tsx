import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import xrplLogo from "./assets/xrpl.svg";
import "./App.css";

import { Wallet, Client, type SubmittableTransaction } from "xrpl";

import { Buffer } from "buffer";

function App() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [count, setCount] = useState(0);
  const [writeError, setWriteError] = useState<Error | null>(null);

  const client = new Client("wss://s.altnet.rippletest.net:51233");

  useEffect(() => {
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

  }, []);


  const handleAction = (action: "inc" | "dec" | "reset") => async () => {
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
    } catch (err: any) {
      console.error(err);
      setWriteError(err);
    }

    setIsPending(false);
  };

  return (
    <>
      <div className="logo-container">
        <a href="https://vite.dev" target="_blank"><img src={viteLogo} className="logo" alt="Vite"/></a>
        <a href="https://react.dev" target="_blank"><img src={reactLogo} className="logo react" alt="React"/></a>
        <a href="https://xrpl.org/" target="_blank"><img src={xrplLogo} className="logo xrpl" alt="XRP LEDGER"/></a>
      </div>

      <h1>Vite + React + xrpl.js</h1>

      <h2 className="counter">Count: {count}</h2>

      <div className="btn-group">
        <button className="btn" onClick={handleAction("dec")} disabled={!isConnected || isPending}>
          {isPending ? "Processing..." : "Decrement (-1)"}
        </button>

        <button className="btn btn-primary" onClick={handleAction("inc")} disabled={!isConnected || isPending}>
          {isPending ? "Processing..." : "Increment (+1)"}
        </button>

        <button className="btn btn-danger" onClick={handleAction("reset")} disabled={!isConnected || isPending}>
          {isPending ? "Processing..." : "Reset (0)"}
        </button>
      </div>

      <details className="debug">
        <summary>Debug Info</summary>
        <div>
          <p><strong>isConnected:</strong> {isConnected.toString()}</p>
          <p><strong>isPending:</strong> {isPending.toString()}</p>
          <p><strong>Wallet Address:</strong> {wallet?.address ?? "undifind"}</p>
          <p><strong>Current Count:</strong> {count}</p>
          <p><strong>Write Error:</strong> {writeError?.message ?? "none"}</p>
        </div>
      </details>
    </>
  );
}

export default App;
