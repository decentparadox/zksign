# ZKSign Circuits

Zero-knowledge proof circuits for credential verification using Noir.

## Circuits

This package contains four Noir circuits for different credential types:

1. **college_id.nr** - College ID credential verification
2. **citizenship_card.nr** - Citizenship Card verification
3. **drivers_license.nr** - Driver's License verification
4. **vehicle_registration.nr** - Vehicle Registration verification

## Features

Each circuit implements:
- **Poseidon Hash Commitment**: All private fields are committed using ZK-friendly Poseidon hash
- **Selective Disclosure**: Bitmap-based field revelation control
- **Predicates**: Age checks, validity checks, membership proofs
- **Issuer Signature Verification**: Cryptographic proof of issuer authenticity
- **Holder Binding**: Public key binding to prevent credential transfer

## Building Circuits

To compile the circuits, you need [Noir](https://noir-lang.org/) installed:

```bash
# Install nargo (Noir compiler)
curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash
noirup

# Compile all circuits
cd circuits
nargo compile
```

## Usage

```typescript
import { generateProof, formatProofForChain } from "@zksign/zk-circuits";

// Generate a proof
const proof = await generateProof({
  credentialType: "college-id",
  credential: myCredential,
  disclosureScope: {
    fields: ["institutionName", "studentStatus"],
    predicates: [{ type: "age_over_18" }],
  },
  issuerPublicKey: "0x...",
  currentTimestamp: Date.now() / 1000,
});

// Format for on-chain verification
const { proofBytes, publicInputs } = formatProofForChain(proof);
```

## Circuit Details

### College ID Circuit
- 16 private input fields
- Predicates: age >= 18, year validity (1-4), active status
- Selective disclosure of: name, institution, program, year, status

### Citizenship Card Circuit
- 18 private input fields
- Predicates: age >= 18/21, nationality match, expiry check
- Selective disclosure of: name, nationality, gender, address

### Driver's License Circuit
- 16 private input fields
- Predicates: age >= 18/21, class match, expiry check
- Selective disclosure of: name, license number, class, restrictions

### Vehicle Registration Circuit
- 16 private input fields
- Predicates: registration validity, insurance check, year range
- Selective disclosure of: registration #, owner, make, model, year

