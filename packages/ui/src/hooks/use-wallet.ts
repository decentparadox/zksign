"use client";

import { useState, useEffect } from "react";

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);

  useEffect(() => {
    checkConnection();

    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }

    return () => {
      if (typeof window !== "undefined" && window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        const chain = await window.ethereum.request({
          method: "eth_chainId",
        });
        
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
        }
        setChainId(parseInt(chain, 16));
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

  const handleChainChanged = (chainIdHex: string) => {
    setChainId(parseInt(chainIdHex, 16));
  };

  const connect = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("MetaMask not installed");
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const chain = await window.ethereum.request({
        method: "eth_chainId",
      });
      
      setAddress(accounts[0]);
      setIsConnected(true);
      setChainId(parseInt(chain, 16));
      
      return accounts[0];
    } catch (error) {
      throw error;
    }
  };

  const disconnect = () => {
    setAddress(null);
    setIsConnected(false);
  };

  return {
    address,
    isConnected,
    chainId,
    connect,
    disconnect,
  };
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

