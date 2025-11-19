# ZKSign Holder Wallet

Self-sovereign identity wallet for managing verifiable credentials.

## Features

- **MetaMask Integration**: Wallet as DID
- **Credential Import**: Import credentials from issuers
- **Selective Disclosure**: Choose which fields to reveal
- **ZK Proof Generation**: Generate proofs locally in browser
- **QR Code Sharing**: Present credentials via QR code
- **Privacy-Preserving**: Only disclose what's necessary

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

Open [http://localhost:3002](http://localhost:3002) in your browser.

## Usage Flow

1. Connect MetaMask wallet (holder DID)
2. Import credential using credential ID
3. View credential details
4. Select "Share" on credential
5. Choose fields to disclose
6. Select predicates to prove
7. Generate ZK proof
8. Display QR code for verifier

## Selective Disclosure

For each credential, you can:
- Choose which fields to reveal
- Keep sensitive fields hidden
- Prove statements without revealing data (e.g., age >= 18 without revealing exact age)

All proof generation happens locally in your browser using Web Assembly compiled Noir circuits.

