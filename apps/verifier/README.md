# ZKSign Verifier App

Verify credentials with zero-knowledge proofs on-chain.

## Features

- **QR Code Scanning**: Camera-based QR code scanning
- **On-Chain Verification**: All proof verification happens on blockchain
- **Privacy-Preserving**: Only see disclosed fields
- **Revocation Check**: Query OrbitDB for revocation status
- **Transaction Receipts**: Blockchain proof of verification

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

Open [http://localhost:3003](http://localhost:3003) in your browser.

## Verification Flow

1. Scan holder's QR code
2. Parse proof data:
   - ZK proof bytes
   - Public inputs
   - Credential type
   - Disclosed fields
   - Verifier contract address
3. Call appropriate verifier contract on-chain:
   - `CollegeIDVerifier.verifyCollegeID()`
   - `CitizenshipCardVerifier.verifyCitizenshipCard()`
   - `DriversLicenseVerifier.verifyDriversLicense()`
   - `VehicleRegistrationVerifier.verifyVehicleRegistration()`
4. Check revocation status in OrbitDB
5. Display results:
   - Valid/Invalid status
   - Disclosed fields only
   - Predicate results
   - Transaction hash
   - Issuer information

## Privacy Guarantees

- **No Local Verification**: All verification happens on-chain
- **Selective Disclosure**: Only disclosed fields are visible
- **Zero-Knowledge**: Predicates proven without revealing underlying data
- **Blockchain Proof**: Transaction receipt proves verification occurred

## Mobile Support

The QR scanner works on mobile devices using the device camera. Grant camera permissions when prompted.

