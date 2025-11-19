# ZKSign OrbitDB Package

Decentralized credential storage using OrbitDB and IPFS.

## Features

- **IPFS Node**: Helia-based IPFS node for peer-to-peer storage
- **Credential Store**: OrbitDB document store for credentials
- **Revocation Store**: OrbitDB event log for revocation tracking
- **Encryption**: Credential data encryption (simplified)

## Usage

### Initialize IPFS and OrbitDB

```typescript
import { 
  initIPFS, 
  initCredentialStore, 
  initRevocationStore 
} from "@zksign/orbitdb";

// Initialize IPFS node
await initIPFS();

// Initialize credential store
await initCredentialStore();

// Initialize revocation store
await initRevocationStore();
```

### Store Credentials

```typescript
import { storeCredential } from "@zksign/orbitdb";

const credential = {
  credentialId: "cred-123",
  credentialType: "college-id",
  encryptedData: "...", // Encrypted credential data
  holderPublicKey: "0x...",
  issuerPublicKey: "0x...",
  commitment: "...",
  issuedAt: Date.now(),
  expiresAt: Date.now() + 365 * 24 * 60 * 60 * 1000,
};

const hash = await storeCredential(credential);
```

### Retrieve Credentials

```typescript
import { 
  getCredential,
  getCredentialsByHolder 
} from "@zksign/orbitdb";

// Get single credential
const credential = await getCredential("cred-123");

// Get all credentials for holder
const credentials = await getCredentialsByHolder("0x...");
```

### Revocation

```typescript
import { 
  revokeCredential,
  isCredentialRevoked 
} from "@zksign/orbitdb";

// Revoke credential
await revokeCredential(
  "cred-123",
  "issuer-signature",
  "Credential expired"
);

// Check revocation status
const revoked = await isCredentialRevoked("cred-123");
```

## Architecture

### IPFS/Helia
- Peer-to-peer content-addressed storage
- WebRTC and WebSocket support for browser
- Automatic peer discovery

### OrbitDB
- Serverless distributed database on IPFS
- Two stores:
  - **Document Store**: For credential data
  - **Event Log**: For revocation events
- Automatic conflict resolution
- Replication across peers

## Security Notes

This implementation uses simplified encryption for demonstration. In production:

1. Use proper asymmetric encryption (e.g., ECIES)
2. Implement access control lists (ACLs)
3. Add peer authentication
4. Use secure key management
5. Implement credential rotation

## Development

```bash
# Build
pnpm build

# Type check
pnpm type-check
```

