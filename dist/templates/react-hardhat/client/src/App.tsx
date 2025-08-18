import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import hardhatLogo from './assets/hardhat.svg'
import './App.css'
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "./utils/contract.ts";

function App() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [count, setCount] = useState<number>(0);

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
    query: { enabled: isConnected }
  });

  useEffect(() => {
    if (counterValue !== undefined && counterValue !== null) {
      try {
        setCount(Number(counterValue));
      } catch (err) {
        console.error("counterValue conversion error:", counterValue, err);
        setCount(0);
      }
    }
  }, [counterValue]);

  const {
    data: txHash,
    writeContract,
    error: writeError,
    isPending
  } = useWriteContract({
    mutation: {
      onSuccess: () => {
        console.log("Transaction successful!");
        setTimeout(() => refetch(), 2000);
      },
      onError: (error) => console.error("Transaction failed:", error)
    }
  });
  const { isSuccess: isReceiptSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const handleAction = (fn: string) => async () => {
    if (!isConnected) return alert("Please connect your wallet first!");
    try {
      await writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: fn
      });
    } catch (err) {
      console.error("Transaction error:", err);
    }
  }

  useEffect(() => {
    if (isReceiptSuccess) refetch();
  }, [isReceiptSuccess]);

  if (isLoading) return <div>Loading contract data...</div>;

  if (isError) {
    return (
        <div>
          <h2>Failed to load contract data</h2>
          <p><strong>Error message:</strong> {error?.message || 'Unknown error'}</p>
          <button onClick={() => refetch()}>Retry</button>
        </div>
    );
  }

  return (
      <>
        <div className="logo-container">
          <a href="https://vite.dev" target="_blank"><img src={viteLogo} className="logo" alt="Vite"/></a>
          <a href="https://react.dev" target="_blank"><img src={reactLogo} className="logo react" alt="React"/></a>
          <a href="https://v2.hardhat.org/" target="_blank"><img src={hardhatLogo} className="logo hardhat"
                                                                 alt="Hardhat"/></a>
        </div>

        <h1>Vite + React + Hardhat</h1>

        <h2 className="counter">Count: {count}</h2>

        <div className="btn-group">
          <button className="btn" onClick={handleAction("dec")} disabled={!isConnected || isPending}>
            {isPending ? 'Processing...' : 'Decrement (-1)'}
          </button>

          <button className="btn btn-primary" onClick={handleAction("inc")} disabled={!isConnected || isPending}>
            {isPending ? 'Processing...' : 'Increment (+1)'}
          </button>

          <button className="btn btn-danger" onClick={handleAction("reset")} disabled={!isConnected || isPending}>
            {isPending ? 'Processing...' : 'Reset (0)'}
          </button>
        </div>

        <div className="wallet">
          {isConnected ? (
              <>
                <p>Connected: {address}</p>
                <button className="btn" onClick={() => disconnect()}>Disconnect</button>
              </>
          ) : connectors.map(c => (
              <button className="btn" key={c.id} onClick={() => connect({connector: c})}>
                Connect with {c.name}
              </button>
          ))}
        </div>

        <details className="debug">
          <summary>Debug Info</summary>
          <div>
            <p><strong>CONTRACT_ADDRESS:</strong> {CONTRACT_ADDRESS}</p>
            <p><strong>isConnected:</strong> {isConnected.toString()}</p>
            <p><strong>counterValue:</strong> {counterValue?.toString() ?? 'undefined'}</p>
            <p><strong>count:</strong> {count}</p>
            <p><strong>writeError:</strong> {writeError?.message ?? 'none'}</p>
          </div>
        </details>
      </>
  );
}

export default App;
