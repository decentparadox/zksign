"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { sepolia, hardhat } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { injected } from "wagmi/connectors";
import { Toaster } from "@zksign/ui";
import { ReactNode, useState } from "react";

const config = createConfig({
  chains: [sepolia, hardhat],
  connectors: [
    injected({ target: "metaMask" }),
  ],
  transports: {
    [sepolia.id]: http(),
    [hardhat.id]: http("http://127.0.0.1:8545"),
  },
});

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
