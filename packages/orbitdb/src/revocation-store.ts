import { createOrbitDB } from "@orbitdb/core";
import type { OrbitDB } from "@orbitdb/core";
import { getIPFS } from "./ipfs";
import type { RevocationEvent } from "./types";

let revocationOrbitDB: OrbitDB | null = null;
let revocationStore: any = null;

/**
 * Initialize OrbitDB revocation event log
 */
export async function initRevocationStore(directory?: string): Promise<void> {
  try {
    const ipfs = getIPFS();

    // Create OrbitDB instance for revocations
    if (!revocationOrbitDB) {
      revocationOrbitDB = await createOrbitDB({
        ipfs,
        directory: directory || "./orbitdb/revocations",
      });
      console.log("Revocation OrbitDB initialized");
    }

    // Create or open revocation event log
    if (!revocationStore) {
      revocationStore = await revocationOrbitDB.open("revocations", {
        type: "eventlog",
        accessController: {
          type: "orbitdb",
          write: ["*"], // In production, restrict to authorized issuers
        },
      });
      console.log("Revocation store opened:", revocationStore.address);
    }
  } catch (error) {
    console.error("Failed to initialize revocation store:", error);
    throw new Error("Revocation store initialization failed");
  }
}

/**
 * Add a revocation event
 */
export async function revokeCredential(
  credentialId: string,
  issuerSignature: string,
  reason?: string
): Promise<string> {
  if (!revocationStore) {
    throw new Error("Revocation store not initialized");
  }

  try {
    const revocationEvent: RevocationEvent = {
      credentialId,
      revokedAt: Date.now(),
      reason,
      issuerSignature,
    };

    const hash = await revocationStore.add(revocationEvent);
    console.log(`Credential ${credentialId} revoked with hash:`, hash);
    return hash;
  } catch (error) {
    console.error("Failed to add revocation:", error);
    throw new Error("Failed to revoke credential");
  }
}

/**
 * Check if a credential is revoked
 */
export async function isCredentialRevoked(credentialId: string): Promise<boolean> {
  if (!revocationStore) {
    throw new Error("Revocation store not initialized");
  }

  try {
    // Iterate through event log to find revocation
    const events = revocationStore.iterator({ limit: -1 }).collect();

    for (const event of events) {
      if (event.payload.value.credentialId === credentialId) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("Failed to check revocation status:", error);
    return false;
  }
}

/**
 * Get revocation event for a credential
 */
export async function getRevocationEvent(
  credentialId: string
): Promise<RevocationEvent | null> {
  if (!revocationStore) {
    throw new Error("Revocation store not initialized");
  }

  try {
    const events = revocationStore.iterator({ limit: -1 }).collect();

    for (const event of events) {
      const revocation = event.payload.value as RevocationEvent;
      if (revocation.credentialId === credentialId) {
        return revocation;
      }
    }

    return null;
  } catch (error) {
    console.error("Failed to get revocation event:", error);
    return null;
  }
}

/**
 * Get all revocation events
 */
export async function getAllRevocations(): Promise<RevocationEvent[]> {
  if (!revocationStore) {
    throw new Error("Revocation store not initialized");
  }

  try {
    const events = revocationStore.iterator({ limit: -1 }).collect();
    return events.map((event: any) => event.payload.value as RevocationEvent);
  } catch (error) {
    console.error("Failed to get all revocations:", error);
    return [];
  }
}

/**
 * Get revocation store address for replication
 */
export function getRevocationStoreAddress(): string {
  if (!revocationStore) {
    throw new Error("Revocation store not initialized");
  }
  return revocationStore.address;
}

/**
 * Close revocation store
 */
export async function closeRevocationStore(): Promise<void> {
  if (revocationStore) {
    await revocationStore.close();
    revocationStore = null;
    console.log("Revocation store closed");
  }

  if (revocationOrbitDB) {
    await revocationOrbitDB.stop();
    revocationOrbitDB = null;
    console.log("Revocation OrbitDB stopped");
  }
}

