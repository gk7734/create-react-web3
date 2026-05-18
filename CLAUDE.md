# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

`create-react-web3-cli` is a published npm CLI (`npx create-react-web3-cli <name>`) that scaffolds React-based web3 starter projects by copying a bundled template and installing its dependencies.

## Important: there is no build step

The repo has **no `src/` directory and no build script**. The authored code lives directly in `dist/` — plain ESM JavaScript, no TypeScript. `dist/` is committed to git *and* published to npm (the `bin` field points at `dist/bin/create-react-web3.js`). Edit files under `dist/` directly; there is nothing to transpile.

## Commands

- Run the CLI locally: `node dist/bin/create-react-web3.js <project-name>`
- There are no tests, lint, or build commands at the CLI repo level.
- Release: bump `version` in `package.json`, then `npm publish` (package manager is pnpm — `pnpm-lock.yaml` is committed).

## CLI architecture (`dist/bin/`)

`create-react-web3.js` is the entrypoint. Flow:

1. `helpers/promptUser.js` — collects all answers via `inquirer`. Prompt groups: initial (project name, framework), then the `web3` platform, `example` choice, and package manager. The `web3` answer is a numeric value: **0=Ethereum, 1=BNB, 2=Solana, 3=XRPL**.
2. Branch on `framework` — both branches copy a bundled template and install its deps; they differ only in which `dist/templates/` set they use:
   - `createReactApp.js` — copies a `react-*` template (`fs-extra` `copy`) from `dist/templates/`, then runs the package manager's install in each sub-folder via `execa`.
   - `createNextApp.js` — same logic for the `next-*` templates. It reuses the `EXAMPLE_NONE` constant exported by `createReactApp.js`; the rest (package-manager helpers, `printNextSteps`, copy/install loop) is a parallel implementation.

Template selection in each helper is driven by its own `TEMPLATES` map: `web3` 0/1 → `{react,next}-hardhat-{eth,bnb}` (installs in both `blockchain/` and `client/`); `web3` 3 → `{react,next}-xrpl` (single folder). **Solana (`web3 === 2`) has no template** — both helpers print a notice and exit; add a `dist/templates/` folder and a `TEMPLATES` entry to support it.

The `example` answer controls the demo code. `"Use example template"` keeps the bundled Counter dApp. `"No example (smart fresh)"` (the `EXAMPLE_NONE` constant) keeps the Web3 wiring but replaces the project's main component with a minimal starter copied from `dist/templates/_fresh/`: React templates swap `App.tsx` (`_fresh/{evm,xrpl}/App.tsx`), Next.js templates swap `src/app/page.tsx` (`_fresh/next-{evm,xrpl}/page.tsx`). The `_fresh` directory is not a selectable template — each helper only ever copies `templates/<TEMPLATES[web3].name>`, so `_fresh` is never picked up as a project template.

## Generated project templates (`dist/templates/`)

- `react-hardhat-eth`, `react-hardhat-bnb` — two-folder layout: `blockchain/` (Hardhat 3 + Solidity, a `Counter.sol` example) and `client/` (Vite + React 19 + TypeScript, using `wagmi`/`viem`).
- `react-xrpl` — single Vite/React app using `xrpl`.
- `next-hardhat-eth`, `next-hardhat-bnb` — same two-folder layout, but `client/` is a Next.js 15 App Router app (TypeScript, `wagmi`/`viem`). The `blockchain/` folders are verbatim copies of the matching `react-*` template (Hardhat is framework-agnostic).
- `next-xrpl` — single Next.js 15 App Router app using `xrpl`.

Two files in the hardhat `client/` templates are the documented user-edit points after scaffolding:
- `src/utils/config.ts` — wagmi `createConfig` (chains, connectors, RPC transports). In the `next-*` templates this is a `getConfig()` factory (SSR-safe) rather than a module-level constant.
- `src/utils/contract.ts` — `CONTRACT_ADDRESS` (empty by default) and `CONTRACT_ABI`.

The `next-*` client apps wire wagmi for the App Router: `src/app/providers.tsx` holds the `'use client'` provider tree and `src/app/layout.tsx` restores the wallet connection from cookies (`cookieToInitialState`) for SSR-safe hydration.

Inside a generated React `client/` (or `react-xrpl`): `npm run dev` (Vite), `npm run build` (`tsc -b && vite build`), `npm run lint`. Inside a Next.js `client/` (or `next-xrpl`): `npm run dev` / `build` / `start` (Next.js), `npm run lint`.

## Conventions

- ESM only (`"type": "module"`); use `import`/`export` and `.js` extensions in import paths.
- CLI user-facing output uses `chalk` for color, `ora` for spinners, `figlet` + `gradient-string` for the startup banner (`printBanner` in `create-react-web3.js`), and `boxen` for the "next steps" guide (`printNextSteps`, defined in both `createReactApp.js` and `createNextApp.js`). Both helpers print `[i/N]` step tags as they copy and install.
- Some inline comments in the CLI code are in Korean; recent commit messages mix Korean and English.
