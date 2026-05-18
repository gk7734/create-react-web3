import { createConfig, createStorage, cookieStorage, http } from "wagmi";
import { injected, metaMask } from "wagmi/connectors";
import { hardhat, mainnet, bscTestnet } from "viem/chains";

/**
 * wagmi config factory.
 *
 * This is a function (not a module-level constant) so the Next.js server
 * and the browser each build their own instance — required for SSR-safe
 * hydration with the App Router.
 *
 * Edit the chains / connectors / transports below to match your dApp.
 */
export function getConfig() {
  return createConfig({
    chains: [mainnet, bscTestnet, hardhat],
    connectors: [injected(), metaMask()],
    ssr: true,
    storage: createStorage({ storage: cookieStorage }),
    transports: {
      [mainnet.id]: http(),
      [bscTestnet.id]: http("https://bsc-testnet.public.blastapi.io"),
      [hardhat.id]: http("http://127.0.0.1:8545"),
    },
  });
}

declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}
