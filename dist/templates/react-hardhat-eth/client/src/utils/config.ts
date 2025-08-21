import {createConfig, http} from "wagmi";
import { injected, metaMask } from  "wagmi/connectors"
import {hardhat, mainnet, sepolia} from "viem/chains";

export const config = createConfig({
  chains: [mainnet, sepolia, hardhat],
  connectors: [
      injected(),
      metaMask(),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [hardhat.id]: http('http://127.0.0.1:8545'),
  }
})
