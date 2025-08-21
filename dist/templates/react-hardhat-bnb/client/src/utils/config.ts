import {createConfig, http} from "wagmi";
import { injected, metaMask } from  "wagmi/connectors"
import {hardhat, mainnet, bscTestnet} from "viem/chains";

export const config = createConfig({
  chains: [mainnet, bscTestnet, hardhat],
  connectors: [
      injected(),
      metaMask(),
  ],
  transports: {
    [mainnet.id]: http(),
    [bscTestnet.id]: http("https://bsc-testnet.public.blastapi.io"),
    [hardhat.id]: http(),
  }
})
