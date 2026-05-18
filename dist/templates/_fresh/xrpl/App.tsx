/**
 * Minimal "smart fresh" starter for the XRPL template.
 * Used when the project is created without the counter example.
 * A testnet client connection is kept so you can start building right away.
 */

import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import xrplLogo from './assets/xrpl.svg'
import './App.css'
import { Wallet, Client } from 'xrpl'

// Created once at module scope so a single connection is shared.
const client = new Client('wss://s.altnet.rippletest.net:51233')

function App() {
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    async function init() {
      try {
        await client.connect()
        setIsConnected(true)
        setWallet(Wallet.generate())
      } catch (err) {
        console.error(err)
      }
    }

    init()
  }, [])

  return (
    <>
      <div className="logo-container">
        <a href="https://vite.dev" target="_blank"><img src={viteLogo} className="logo" alt="Vite" /></a>
        <a href="https://react.dev" target="_blank"><img src={reactLogo} className="logo react" alt="React" /></a>
        <a href="https://xrpl.org/" target="_blank"><img src={xrplLogo} className="logo xrpl" alt="XRP LEDGER" /></a>
      </div>

      <h1>Vite + React + xrpl.js</h1>
      <p>
        Edit <code>src/App.tsx</code> and start building on the XRP Ledger.
      </p>

      <div className="debug">
        <p><strong>Testnet:</strong> {isConnected ? 'connected' : 'connecting...'}</p>
        <p><strong>Wallet:</strong> {wallet?.address ?? '-'}</p>
      </div>
    </>
  )
}

export default App
