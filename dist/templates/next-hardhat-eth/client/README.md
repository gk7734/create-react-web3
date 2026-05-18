# Next.js + Hardhat (Ethereum)

The frontend of a React + Web3 starter, scaffolded by
[`create-react-web3-cli`](https://www.npmjs.com/package/create-react-web3-cli).

Built with **Next.js 15 (App Router)**, **wagmi**, and **viem**.

## Getting started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Web3 wiring

These two files are the documented edit points after scaffolding:

- `src/utils/config.ts` — wagmi `createConfig` (chains, connectors, RPC
  transports). Exposed as a `getConfig()` factory so the server and the
  browser each build their own SSR-safe instance.
- `src/utils/contract.ts` — `CONTRACT_ADDRESS` (empty by default) and
  `CONTRACT_ABI`. Paste the address you get from deploying the contract in
  the sibling `blockchain/` folder.

The provider tree lives in `src/app/providers.tsx`; `src/app/layout.tsx`
restores the wallet connection from cookies for SSR-safe hydration.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — run ESLint
