"use client";

/**
 * Minimal "smart fresh" starter for the Next.js + XRPL template.
 * Used when the project is created without the counter example.
 * A testnet client connection is kept so you can start building right away.
 */

import { useEffect, useState } from "react";
import { Wallet, Client } from "xrpl";

const TESTNET_URL = "wss://s.altnet.rippletest.net:51233";

export default function Home() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const client = new Client(TESTNET_URL);

    async function init() {
      try {
        await client.connect();
        setIsConnected(true);
        setWallet(Wallet.generate());
      } catch (err) {
        console.error(err);
      }
    }

    init();

    return () => {
      client.disconnect();
    };
  }, []);

  return (
    <main className="container">
      <h1>Next.js + xrpl.js</h1>
      <p>
        Edit <code>src/app/page.tsx</code> and start building on the XRP Ledger.
      </p>

      <div className="debug">
        <p><strong>Testnet:</strong> {isConnected ? "connected" : "connecting..."}</p>
        <p><strong>Wallet:</strong> {wallet?.address ?? "-"}</p>
      </div>
    </main>
  );
}
