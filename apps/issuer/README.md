# ZKSign Issuer App

Issuer portal for creating and issuing verifiable credentials.

## Features

- **MetaMask Integration**: Connect wallet as issuer DID
- **Four Credential Types**: College ID, Citizenship Card, Driver's License, Vehicle Registration
- **On-Chain Registration**: Register credentials in CredentialRegistry contract
- **Decentralized Storage**: Store credentials in OrbitDB
- **Credential Management**: View and manage issued credentials

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

## Issuance Flow

1. Connect MetaMask wallet (issuer DID)
2. Select credential type to issue
3. Fill in all credential fields
4. Submit form
5. Sign with MetaMask
6. Credential is:
   - Stored in OrbitDB (encrypted)
   - Registered on-chain via CredentialRegistry
   - Credential ID provided to holder

## Credential Types

### College ID
16 fields including student information, institution details, and validity dates.

### Citizenship Card
18 fields including personal information, national ID, and biometric data.

### Driver's License
16 fields including license details, vehicle class, and restrictions.

### Vehicle Registration
16 fields including vehicle information, owner details, and insurance.

