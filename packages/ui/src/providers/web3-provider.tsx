"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { sepolia, hardhat } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { injected } from "wagmi/connectors";
import { type ReactNode, useMemo } from "react";

interface Web3ProviderProps {
  children: ReactNode;
}

// Create queryClient outside component to avoid recreating on every render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export function Web3Provider({ children }: Web3ProviderProps) {
  const config = useMemo(
    () =>
      createConfig({
        chains: [sepolia, hardhat],
        connectors: [
          injected({ 
            target: "metaMask",
            shimDisconnect: true,
          }),
        ],
        transports: {
          [sepolia.id]: http(),
          [hardhat.id]: http("http://127.0.0.1:8545"),
        },
      }),
    []
  );

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

