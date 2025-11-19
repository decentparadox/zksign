import { createOrbitDB } from "@orbitdb/core";
import type { OrbitDB } from "@orbitdb/core";
import { getIPFS } from "./ipfs";
import type { StoredCredential } from "./types";

let orbitDBInstance: OrbitDB | null = null;
let credentialStore: any = null;

/**
 * Initialize OrbitDB and credential store
 */
export async function initCredentialStore(directory?: string): Promise<void> {
  try {
    const ipfs = getIPFS();

    // Create OrbitDB instance
    if (!orbitDBInstance) {
      orbitDBInstance = await createOrbitDB({
        ipfs,
        directory: directory || "./orbitdb/credentials",
      });
      console.log("OrbitDB initialized");
    }

    // Create or open credential document store
    if (!credentialStore) {
      credentialStore = await orbitDBInstance.open("credentials", {
        type: "documents",
        accessController: {
          type: "orbitdb",
          write: ["*"], // In production, restrict to specific peers
        },
      });
      console.log("Credential store opened:", credentialStore.address);
    }
  } catch (error) {
    console.error("Failed to initialize credential store:", error);
    throw new Error("Credential store initialization failed");
  }
}

/**
 * Store a credential in OrbitDB
 */
export async function storeCredential(credential: StoredCredential): Promise<string> {
  if (!credentialStore) {
    throw new Error("Credential store not initialized");
  }

  try {
    // Put credential in document store with credentialId as key
    const hash = await credentialStore.put(credential, {
      pin: true, // Pin to ensure persistence
    });

    console.log(`Credential ${credential.credentialId} stored with hash:`, hash);
    return hash;
  } catch (error) {
    console.error("Failed to store credential:", error);
    throw new Error("Failed to store credential in OrbitDB");
  }
}

/**
 * Retrieve a credential by ID
 */
export async function getCredential(credentialId: string): Promise<StoredCredential | null> {
  if (!credentialStore) {
    throw new Error("Credential store not initialized");
  }

  try {
    // Query document store by credentialId
    const results = await credentialStore.query(
      (doc: StoredCredential) => doc.credentialId === credentialId
    );

    if (results.length === 0) {
      return null;
    }

    return results[0] as StoredCredential;
  } catch (error) {
    console.error("Failed to retrieve credential:", error);
    return null;
  }
}

/**
 * Get all credentials for a holder
 */
export async function getCredentialsByHolder(holderPublicKey: string): Promise<StoredCredential[]> {
  if (!credentialStore) {
    throw new Error("Credential store not initialized");
  }

  try {
    const results = await credentialStore.query(
      (doc: StoredCredential) => doc.holderPublicKey === holderPublicKey
    );

    return results as StoredCredential[];
  } catch (error) {
    console.error("Failed to retrieve credentials for holder:", error);
    return [];
  }
}

/**
 * Get all credentials issued by an issuer
 */
export async function getCredentialsByIssuer(issuerPublicKey: string): Promise<StoredCredential[]> {
  if (!credentialStore) {
    throw new Error("Credential store not initialized");
  }

  try {
    const results = await credentialStore.query(
      (doc: StoredCredential) => doc.issuerPublicKey === issuerPublicKey
    );

    return results as StoredCredential[];
  } catch (error) {
    console.error("Failed to retrieve credentials for issuer:", error);
    return [];
  }
}

/**
 * Delete a credential (for cleanup, not for revocation)
 */
export async function deleteCredential(credentialId: string): Promise<boolean> {
  if (!credentialStore) {
    throw new Error("Credential store not initialized");
  }

  try {
    await credentialStore.del(credentialId);
    console.log(`Credential ${credentialId} deleted`);
    return true;
  } catch (error) {
    console.error("Failed to delete credential:", error);
    return false;
  }
}

/**
 * Get credential store address for replication
 */
export function getCredentialStoreAddress(): string {
  if (!credentialStore) {
    throw new Error("Credential store not initialized");
  }
  return credentialStore.address;
}

/**
 * Close credential store
 */
export async function closeCredentialStore(): Promise<void> {
  if (credentialStore) {
    await credentialStore.close();
    credentialStore = null;
    console.log("Credential store closed");
  }

  if (orbitDBInstance) {
    await orbitDBInstance.stop();
    orbitDBInstance = null;
    console.log("OrbitDB stopped");
  }
}

