"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { formatAddress } from "../lib/utils";
import { Wallet } from "lucide-react";
import { toast } from "./ui/use-toast";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function WalletConnect() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    checkConnection();
    
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", () => window.location.reload());
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ 
          method: "eth_accounts" 
        });
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
        }
      } catch (error) {
        console.error("Error checking connection:", error);
      }
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setAddress(null);
      setIsConnected(false);
    } else {
      setAddress(accounts[0]);
      setIsConnected(true);
    }
  };

  const connect = async () => {
    if (typeof window.ethereum === "undefined") {
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask to connect your wallet",
        variant: "destructive",
      });
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAddress(accounts[0]);
      setIsConnected(true);
      toast({
        title: "Connected",
        description: "Wallet connected successfully",
      });
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  const disconnect = () => {
    setAddress(null);
    setIsConnected(false);
    toast({
      title: "Disconnected",
      description: "Wallet disconnected",
    });
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <div className="text-sm text-muted-foreground">
          {formatAddress(address)}
        </div>
        <Button onClick={disconnect} variant="outline" size="sm">
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={connect} variant="default">
      <Wallet className="mr-2 h-4 w-4" />
      Connect MetaMask
    </Button>
  );
}

