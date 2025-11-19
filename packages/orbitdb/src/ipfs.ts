import { createHelia } from "helia";
import { createLibp2p } from "libp2p";
import type { Helia } from "@helia/interface";
import type { IPFSConfig } from "./types";

let heliaInstance: Helia | null = null;

/**
 * Initialize IPFS node using Helia
 */
export async function initIPFS(config?: IPFSConfig): Promise<Helia> {
  if (heliaInstance) {
    return heliaInstance;
  }

  try {
    // Create Helia instance (IPFS implementation)
    // In a browser environment, this automatically configures WebRTC and WebSockets
    heliaInstance = await createHelia({
      ...config,
    });

    console.log("IPFS node initialized with peer ID:", heliaInstance.libp2p.peerId.toString());
    
    return heliaInstance;
  } catch (error) {
    console.error("Failed to initialize IPFS:", error);
    throw new Error("IPFS initialization failed");
  }
}

/**
 * Get existing IPFS instance
 */
export function getIPFS(): Helia {
  if (!heliaInstance) {
    throw new Error("IPFS not initialized. Call initIPFS() first.");
  }
  return heliaInstance;
}

/**
 * Stop IPFS node
 */
export async function stopIPFS(): Promise<void> {
  if (heliaInstance) {
    await heliaInstance.stop();
    heliaInstance = null;
    console.log("IPFS node stopped");
  }
}

/**
 * Check if IPFS is running
 */
export function isIPFSRunning(): boolean {
  return heliaInstance !== null;
}

/**
 * Get peer ID of current node
 */
export function getPeerId(): string {
  const ipfs = getIPFS();
  return ipfs.libp2p.peerId.toString();
}

/**
 * Get connected peers count
 */
export function getConnectedPeersCount(): number {
  const ipfs = getIPFS();
  return ipfs.libp2p.getPeers().length;
}

