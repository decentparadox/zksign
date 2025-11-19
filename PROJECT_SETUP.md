# ZKSign Project Setup Guide

Complete setup guide for the zero-knowledge SSI wallet system.

## Prerequisites

- **Node.js** 18+ and **pnpm** 8+
- **Noir** compiler (`nargo`) - Install from [noir-lang.org](https://noir-lang.org)
- **Hardhat** - Installed via pnpm
- **MetaMask** browser extension

## Installation

```bash
# Install pnpm globally (if not installed)
npm install -g pnpm

# Install dependencies
pnpm install

# Compile Noir circuits
cd packages/zk-circuits/circuits
nargo compile

# Compile Solidity contracts
cd packages/contracts
pnpm compile
```

## Smart Contract Deployment

### 1. Start Local Hardhat Node

```bash
cd packages/contracts
pnpm node
```

### 2. Deploy Contracts

In a new terminal:

```bash
cd packages/contracts
pnpm deploy:local
```

This deploys:
- `CredentialRegistry`
- `CollegeIDVerifier`
- `CitizenshipCardVerifier`
- `DriversLicenseVerifier`
- `VehicleRegistrationVerifier`

Contract addresses are saved to `packages/contracts/deployed-addresses.json`.

### 3. Update Environment Variables

Copy `.env.example` to `.env` in each app directory and update contract addresses.

## Running the Apps

Open three terminal windows:

### Terminal 1: Issuer App
```bash
cd apps/issuer
pnpm dev
# Runs on http://localhost:3001
```

### Terminal 2: Holder App
```bash
cd apps/holder
pnpm dev
# Runs on http://localhost:3002
```

### Terminal 3: Verifier App
```bash
cd apps/verifier
pnpm dev
# Runs on http://localhost:3003
```

## MetaMask Setup

1. Add Hardhat Network to MetaMask:
   - Network Name: Hardhat Local
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 31337
   - Currency: ETH

2. Import Hardhat test accounts:
   - Private keys are in Hardhat console output
   - Use different accounts for issuer, holder, verifier

## End-to-End Test Flow

### 1. Issue a Credential (Issuer App)

1. Open http://localhost:3001
2. Connect MetaMask (issuer account)
3. Click "Issue College ID"
4. Fill in all fields:
   - Full Name: John Doe
   - Date of Birth: 2000-01-01
   - Student ID: MIT123456
   - Institution: MIT
   - Program: Computer Science
   - Year: 3
   - Status: Active
   - Holder Public Key: (holder's MetaMask address)
5. Submit and sign with MetaMask
6. Note the credential ID

### 2. Import Credential (Holder App)

1. Open http://localhost:3002
2. Connect MetaMask (holder account)
3. Click "Import Credential"
4. Enter credential ID from step 1
5. Credential appears in dashboard

### 3. Generate Proof (Holder App)

1. Click on imported credential
2. Click "Share"
3. Select fields to disclose:
   - ✓ Institution Name
   - ✓ Student Status
   - ✗ Full Name (hidden)
   - ✗ Date of Birth (hidden)
4. Select predicates:
   - ✓ Age >= 18
   - ✓ Active Status
5. Click "Generate ZK Proof"
6. QR code appears

### 4. Verify Credential (Verifier App)

1. Open http://localhost:3003
2. Click "Start Camera"
3. Scan QR code from holder's screen
   - Or use "Manual Verification" and paste proof data
4. Proof is verified on-chain
5. Results display:
   - Status: Valid ✅
   - Disclosed: Institution (MIT), Status (Active)
   - Predicates: Age >= 18 ✓, Active Status ✓
   - Hidden: Full Name, Date of Birth, Student ID
   - Transaction hash for verification proof

## Project Structure

```
zksign/
├── apps/
│   ├── issuer/     # Port 3001 - Issue credentials
│   ├── holder/     # Port 3002 - Manage credentials
│   └── verifier/   # Port 3003 - Verify credentials
├── packages/
│   ├── ui/         # Shared Shadcn UI components
│   ├── zk-circuits/    # Noir ZK proof circuits
│   ├── contracts/  # Solidity smart contracts
│   ├── orbitdb/    # Decentralized storage
│   └── typescript-config/  # Shared TS configs
```

## Key Technologies

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **ZK Proofs**: Noir (privacy-preserving proofs)
- **Smart Contracts**: Solidity, Hardhat, OpenZeppelin
- **Blockchain**: Ethereum (Sepolia testnet / local Hardhat)
- **Storage**: OrbitDB (decentralized), IPFS (content-addressed)
- **Web3**: wagmi, viem, MetaMask

## Troubleshooting

### Contracts not deploying
- Ensure Hardhat node is running
- Check account has ETH (use Hardhat test accounts)

### QR Scanner not working
- Grant camera permissions in browser
- Use HTTPS or localhost (required for camera access)

### Proof generation fails
- Ensure Noir circuits are compiled
- Check credential data format matches circuit schema

### MetaMask connection issues
- Ensure correct network selected
- Clear MetaMask activity/nonce data if stuck

## Production Deployment

### Smart Contracts

Deploy to Sepolia testnet:

```bash
cd packages/contracts
# Add PRIVATE_KEY and SEPOLIA_RPC_URL to .env
pnpm deploy:sepolia
```

### Next.js Apps

Deploy to Vercel:

```bash
# Build all apps
turbo build

# Deploy each app separately to Vercel
vercel deploy apps/issuer --prod
vercel deploy apps/holder --prod
vercel deploy apps/verifier --prod
```

Update environment variables in Vercel dashboard with deployed contract addresses.

## Security Notes

**This is a development/demo implementation. For production:**

1. Use proper key management (hardware wallets, HSMs)
2. Implement actual asymmetric encryption (not simplified version)
3. Add access control and authentication
4. Use production-ready IPFS/OrbitDB nodes
5. Implement rate limiting and DoS protection
6. Add comprehensive error handling
7. Perform security audits on smart contracts
8. Use mainnet or secure testnet
9. Implement proper CI/CD pipelines
10. Add monitoring and alerting

## License

MIT

