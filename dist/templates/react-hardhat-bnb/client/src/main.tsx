import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {WagmiProvider} from "wagmi";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {config} from "./utils/config.ts";
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          <App />
        </WagmiProvider>
      </QueryClientProvider>
    </StrictMode>,
)
