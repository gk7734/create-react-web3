# Next.js + xrpl.js

An XRP Ledger starter, scaffolded by
[`create-react-web3-cli`](https://www.npmjs.com/package/create-react-web3-cli).

Built with **Next.js 15 (App Router)** and **xrpl.js**.

## Getting started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How it works

`src/app/page.tsx` is a client component that connects to the XRPL
**testnet** (`wss://s.altnet.rippletest.net:51233`), funds a freshly
generated wallet, and writes the counter value into transaction memos.

The xrpl `Client` is created inside a `useEffect` so it only runs in the
browser — never during server rendering.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — run ESLint
