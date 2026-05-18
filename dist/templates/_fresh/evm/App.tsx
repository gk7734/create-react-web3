/**
 * Minimal "smart fresh" starter for the Hardhat (EVM) template.
 * Used when the project is created without the Counter example.
 * The wagmi wallet wiring is kept so you can start building right away.
 */

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import hardhatLogo from './assets/hardhat.svg'
import './App.css'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

function App() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  return (
    <>
      <div className="logo-container">
        <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
          <img src={viteLogo} className="logo" alt="Vite" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className="logo react" alt="React" />
        </a>
        <a href="https://hardhat.org/" target="_blank" rel="noopener noreferrer">
          <img src={hardhatLogo} className="logo hardhat" alt="Hardhat" />
        </a>
      </div>

      <h1>Vite + React + Hardhat</h1>
      <p>
        Edit <code>src/App.tsx</code> and start building your dApp.
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
    </>
  )
}

export default App
