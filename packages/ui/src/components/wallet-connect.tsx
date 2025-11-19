"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "./ui/button";
import { formatAddress } from "../lib/utils";
import { Wallet } from "lucide-react";

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <div className="text-sm text-muted-foreground">
          {formatAddress(address)}
        </div>
        <Button onClick={() => disconnect()} variant="outline" size="sm">
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={() => {
        const metamask = connectors.find((c) => c.name === "MetaMask");
        if (metamask) {
          connect({ connector: metamask });
        }
      }}
      variant="default"
    >
      <Wallet className="mr-2 h-4 w-4" />
      Connect MetaMask
    </Button>
  );
}

