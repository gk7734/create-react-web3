"use client";

/**
 * Minimal "smart fresh" starter for the Next.js + Hardhat (EVM) template.
 * Used when the project is created without the Counter example.
 * The wagmi wallet wiring is kept so you can start building right away.
 */

import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <main className="container">
      <h1>Next.js + Hardhat</h1>
      <p>
        Edit <code>src/app/page.tsx</code> and start building your dApp.
      </p>

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
    </main>
  );
}
