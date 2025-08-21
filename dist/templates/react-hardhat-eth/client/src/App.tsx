/**
 * @fileoverview Optimized React component for blockchain counter application
 * @description Main App component that provides a decentralized counter interface
 * using Wagmi for Web3 integration with improved performance and code quality
 * @version 1.0.0
 * @author gk7734
 * @date 2025
 */

import {useEffect, useState, useCallback, useMemo} from 'react'
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
import {CONTRACT_ABI, CONTRACT_ADDRESS} from "./utils/contract.ts";

/**
 * Constants moved outside component to prevent recreation on each render
 * @constant {number} CHAIN_ID - BSC Testnet chain ID
 * @constant {number} REFETCH_DELAY - Delay in milliseconds before refetching data
 */
const CHAIN_ID = 11155111;
const REFETCH_DELAY = 2000;

/**
 * @component App
 * @description Main application component for blockchain counter interaction
 * @returns {JSX.Element} The rendered App component
 */
function App() {
  // Wagmi hooks for wallet connection and blockchain interaction
  const {address, isConnected, chain} = useAccount();
  const {connect, connectors} = useConnect();
  const {disconnect} = useDisconnect();

  /**
   * @state {number} count - Local state for counter value display
   * @description Mirrors the blockchain counter value for immediate UI feedback
   */
  const [count, setCount] = useState<number>(0);

  /**
   * @hook useReadContract
   * @description Reads counter value from smart contract with optimized caching
   * @param {Object} config - Configuration object for contract reading
   * @param {string} config.address - Smart contract address
   * @param {Array} config.abi - Contract ABI
   * @param {string} config.functionName - Contract function to call
   * @param {Object} config.query - Query optimization settings
   * @param {boolean} config.query.enabled - Only execute when wallet is connected
   * @param {boolean} config.query.refetchOnWindowFocus - Prevent unnecessary refetches
   * @param {number} config.query.staleTime - Cache duration in milliseconds
   * @param {number} config.chainId - Target blockchain network ID
   */
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
      refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 재요청 방지
      staleTime: 10000, // 10초간 캐시 유지
    },
    chainId: CHAIN_ID
  });

  /**
   * @effect Counter Value Synchronization
   * @description Synchronizes blockchain counter value with local state
   * @param {bigint|number|undefined} counterValue - Raw value from blockchain
   * @dependency counterValue - Triggers when contract value changes
   */
  useEffect(() => {
    if (counterValue !== undefined && counterValue !== null) {
      const newCount = typeof counterValue === 'bigint'
          ? Number(counterValue)
          : Number(counterValue);

      if (!isNaN(newCount)) {
        setCount(newCount);
      } else {
        console.error("Invalid counterValue:", counterValue);
        setCount(0);
      }
    }
  }, [counterValue]);

  /**
   * @hook useWriteContract
   * @description Handles contract write operations with transaction management
   * @param {Object} mutation - Mutation configuration object
   * @param {Function} mutation.onSuccess - Success callback with auto-refetch
   * @param {Function} mutation.onError - Error callback for transaction failures
   */
  const {
    data: txHash,
    writeContract,
    error: writeError,
    isPending
  } = useWriteContract({
    mutation: {
      onSuccess: () => {
        console.log("Transaction successful!");
        // Promise-based setTimeout for more stable refetch handling
        setTimeout(() => {
          refetch();
        }, REFETCH_DELAY);
      },
      onError: (error) => {
        console.error("Transaction failed:", error);
      }
    }
  });

  /**
   * @hook useWaitForTransactionReceipt
   * @description Waits for transaction confirmation with conditional execution
   * @param {string} hash - Transaction hash to monitor
   * @param {Object} query - Query configuration
   * @param {boolean} query.enabled - Only execute when txHash exists
   */
  const {isSuccess: isReceiptSuccess} = useWaitForTransactionReceipt({
    hash: txHash,
    query: {
      enabled: !!txHash, // Only execute when txHash exists
    }
  });

  /**
   * @callback handleAction
   * @description Memoized function factory for contract interaction handlers
   * @param {string} fn - Contract function name to execute ('inc', 'dec', 'reset')
   * @returns {Function} Async event handler for button clicks
   * @memoization useCallback with [isConnected, writeContract] dependencies
   */
  const handleAction = useCallback((fn: string) => {
    return async () => {
      if (!isConnected) {
        alert("Please connect your wallet first!");
        return;
      }

      try {
        await writeContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: CONTRACT_ABI,
          functionName: fn,
          chainId: CHAIN_ID
        });
      } catch (err) {
        console.error("Transaction error:", err);
      }
    };
  }, [isConnected, writeContract]);

  /**
   * @effect Transaction Receipt Handler
   * @description Refetches contract data when transaction is confirmed
   * @dependency isReceiptSuccess - Triggers when transaction receipt is received
   * @dependency refetch - Contract data refetch function
   */
  useEffect(() => {
    if (isReceiptSuccess) {
      refetch();
    }
  }, [isReceiptSuccess, refetch]);

  /**
   * @memo isButtonDisabled
   * @description Memoized computation for button disabled state
   * @returns {boolean} True if buttons should be disabled
   * @memoization useMemo with [isConnected, isPending] dependencies
   */
  const isButtonDisabled = useMemo(() => {
    return !isConnected || isPending;
  }, [isConnected, isPending]);

  /**
   * @memo buttonTexts
   * @description Memoized button text computation based on pending state
   * @returns {Object} Object containing text for each button type
   * @memoization useMemo with [isPending] dependency
   */
  const buttonTexts = useMemo(() => ({
    decrement: isPending ? 'Processing...' : 'Decrement (-1)',
    increment: isPending ? 'Processing...' : 'Increment (+1)',
    reset: isPending ? 'Processing...' : 'Reset (0)'
  }), [isPending]);

  /**
   * @conditionalRender Loading State
   * @description Early return for loading state with optimized container
   * @returns {JSX.Element} Loading indicator component
   */
  if (isLoading) {
    return (
        <div className="loading-container">
          <div>Loading contract data...</div>
        </div>
    );
  }

  /**
   * @conditionalRender Error State
   * @description Early return for error state with retry functionality
   * @returns {JSX.Element} Error display and retry button
   */
  if (isError) {
    return (
        <div className="error-container">
          <h2>Failed to load contract data</h2>
          <p><strong>Error message:</strong> {error?.message || 'Unknown error'}</p>
          <button onClick={() => refetch()}>Retry</button>
        </div>
    );
  }

  /**
   * @render Main Application Interface
   * @description Renders the complete application UI with optimized components
   * @returns {JSX.Element} Main application JSX structure
   */
  return (
      <>
        {/* Logo Container - External links with security attributes */}
        <div className="logo-container">
          <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
            <img src={viteLogo} className="logo" alt="Vite"/>
          </a>
          <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
            <img src={reactLogo} className="logo react" alt="React"/>
          </a>
          <a href="https://v2.hardhat.org/" target="_blank" rel="noopener noreferrer">
            <img src={hardhatLogo} className="logo hardhat" alt="Hardhat"/>
          </a>
        </div>

        {/* Application Title */}
        <h1>Vite + React + Hardhat</h1>

        {/* Counter Display */}
        <h2 className="counter">Count: {count}</h2>

        {/* Action Buttons - Memoized handlers and optimized disabled state */}
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

        {/* Wallet Connection Interface */}
        <div className="wallet">
          {isConnected ? (
              <>
                <p>Connected: {address}</p>
                <button className="btn" onClick={() => disconnect()} type="button">
                  Disconnect
                </button>
              </>
          ) : (
              connectors.map(connector => (
                  <button
                      className="btn"
                      key={connector.id}
                      onClick={() => connect({connector})}
                      type="button"
                  >
                    Connect with {connector.name}
                  </button>
              ))
          )}
        </div>

        {/* Debug Information Panel */}
        <details className="debug">
          <summary>Debug Info</summary>
          <div>
            <p><strong>chain Id:</strong> {chain?.id ?? 'undefined'}</p>
            <p><strong>chain name:</strong> {chain?.name ?? 'undefined'}</p>
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

/**
 * @export default App
 * @description Export the optimized App component as the default export
 */
export default App;
