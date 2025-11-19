# ZKSign - Zero-Knowledge SSI Wallet

A self-sovereign identity wallet backed by zero-trust architecture, using Noir for zero-knowledge proofs and Solidity smart contracts for on-chain verification.

## Architecture

This monorepo contains three stakeholder applications:

- **Issuer App**: Creates and issues verifiable credentials
- **Holder App**: Stores credentials, generates ZK proofs with selective disclosure
- **Verifier App**: Scans QR codes and verifies proofs on-chain

## Supported Credentials

1. College ID
2. Citizenship Card
3. Driver's License
4. Vehicle Registration Card

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Shadcn UI
- **ZK Proofs**: Noir
- **Smart Contracts**: Solidity, Hardhat
- **Decentralized Storage**: OrbitDB, IPFS
- **Web3**: wagmi, viem, MetaMask

## Getting Started

```bash
# Install dependencies
pnpm install

# Run all apps in development mode
pnpm dev

# Build all apps
pnpm build
```

## Project Structure

```
zksign/
├── apps/
│   ├── issuer/          # Credential issuance application
│   ├── holder/          # Credential holder wallet
│   └── verifier/        # Verification application
├── packages/
│   ├── ui/              # Shared UI components
│   ├── zk-circuits/     # Noir ZK circuits
│   ├── contracts/       # Solidity smart contracts
│   ├── orbitdb/         # OrbitDB utilities
│   └── typescript-config/ # Shared TypeScript configs
```

## Key Features

- **Privacy-Preserving**: Selective disclosure of credential attributes
- **On-Chain Verification**: All proof verification happens on blockchain
- **Zero-Knowledge Proofs**: Prove statements without revealing underlying data
- **Self-Sovereign**: Users control their own credentials
- **Decentralized Storage**: Credentials stored on OrbitDB/IPFS

## License

MIT

