export interface StoredCredential {
  credentialId: string;
  credentialType: "college-id" | "citizenship-card" | "drivers-license" | "vehicle-registration";
  encryptedData: string; // Encrypted credential data
  holderPublicKey: string;
  issuerPublicKey: string;
  commitment: string;
  issuedAt: number;
  expiresAt: number;
  metadata?: Record<string, any>;
}

export interface RevocationEvent {
  credentialId: string;
  revokedAt: number;
  reason?: string;
  issuerSignature: string;
}

export interface IPFSConfig {
  repo?: string;
  start?: boolean;
  config?: any;
}

export interface OrbitDBConfig {
  ipfsConfig?: IPFSConfig;
  directory?: string;
}

