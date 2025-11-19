import { BarretenbergBackend } from "@noir-lang/backend_barretenberg";
import { Noir } from "@noir-lang/noir_js";
import type {
  CredentialType,
  ProofGenerationInput,
  ZKProof,
  CompiledCircuit,
} from "./types";
import { hashToField, stringToField, bitmapFromFields } from "./utils";

// Circuit compilation cache
const circuitCache = new Map<CredentialType, CompiledCircuit>();

/**
 * Compile a Noir circuit for a specific credential type
 * In production, circuits should be pre-compiled and loaded
 */
export async function compileCircuit(
  circuitType: CredentialType
): Promise<CompiledCircuit> {
  // Check cache first
  if (circuitCache.has(circuitType)) {
    return circuitCache.get(circuitType)!;
  }

  // In a real implementation, you would load the compiled circuit JSON
  // For now, we'll return a placeholder structure
  // The actual circuit compilation happens build-time with nargo
  
  const circuitPath = `./circuits/${circuitType.replace("-", "_")}`;
  
  // This would typically load the compiled circuit artifact
  // const circuit = require(`${circuitPath}/target/circuit.json`);
  
  throw new Error(
    `Circuit compilation not yet implemented. Circuits must be pre-compiled with nargo. Looking for: ${circuitPath}`
  );
}

/**
 * Generate a ZK proof for a credential with selective disclosure
 * CLIENT-SIDE ONLY - No verification happens here
 */
export async function generateProof(
  input: ProofGenerationInput
): Promise<ZKProof> {
  const {
    credentialType,
    credential,
    disclosureScope,
    issuerPublicKey,
    currentTimestamp,
  } = input;

  // Convert credential fields to circuit inputs based on type
  let circuitInputs: any;
  let disclosedFields: Record<string, any> = {};
  let bitmap = 0;

  switch (credentialType) {
    case "college-id":
      circuitInputs = prepareCollegeIDInputs(
        credential as any,
        disclosureScope,
        issuerPublicKey,
        currentTimestamp
      );
      ({ disclosedFields, bitmap } = prepareCollegeIDDisclosure(
        credential as any,
        disclosureScope
      ));
      break;

    case "citizenship-card":
      circuitInputs = prepareCitizenshipCardInputs(
        credential as any,
        disclosureScope,
        issuerPublicKey,
        currentTimestamp
      );
      ({ disclosedFields, bitmap } = prepareCitizenshipCardDisclosure(
        credential as any,
        disclosureScope
      ));
      break;

    case "drivers-license":
      circuitInputs = prepareDriversLicenseInputs(
        credential as any,
        disclosureScope,
        issuerPublicKey,
        currentTimestamp
      );
      ({ disclosedFields, bitmap } = prepareDriversLicenseDisclosure(
        credential as any,
        disclosureScope
      ));
      break;

    case "vehicle-registration":
      circuitInputs = prepareVehicleRegistrationInputs(
        credential as any,
        disclosureScope,
        issuerPublicKey,
        currentTimestamp
      );
      ({ disclosedFields, bitmap } = prepareVehicleRegistrationDisclosure(
        credential as any,
        disclosureScope
      ));
      break;

    default:
      throw new Error(`Unknown credential type: ${credentialType}`);
  }

  // Load compiled circuit
  // const compiledCircuit = await compileCircuit(credentialType);
  
  // For now, create a mock proof structure
  // In production, this would use Noir to generate the actual proof
  /*
  const backend = new BarretenbergBackend(compiledCircuit.circuit);
  const noir = new Noir(compiledCircuit.circuit, backend);
  
  const { witness } = await noir.execute(circuitInputs);
  const proof = await backend.generateProof(witness);
  */

  // Mock proof for development
  const mockProof = new Uint8Array(128); // Placeholder proof bytes
  const publicInputs = [
    credential.credentialId,
    hashToField(JSON.stringify(credential)), // commitment
    bitmap.toString(),
    issuerPublicKey,
    credential.holderPublicKey || (credential as any).ownerPublicKey,
  ];

  return {
    proof: mockProof,
    publicInputs,
    credentialType,
    disclosedFields,
    verifierContractAddress: "", // Will be set by the app
  };
}

/**
 * Format proof data for on-chain verification
 */
export function formatProofForChain(proof: ZKProof): {
  proofBytes: string;
  publicInputs: string[];
} {
  return {
    proofBytes: "0x" + Buffer.from(proof.proof).toString("hex"),
    publicInputs: proof.publicInputs,
  };
}

// Helper functions for each credential type

function prepareCollegeIDInputs(
  credential: any,
  scope: any,
  issuerPubKey: string,
  timestamp: number
) {
  // Convert all credential fields to circuit format
  const predicates = scope.predicates.reduce((acc: any, p: any) => {
    acc[p.type] = 1;
    return acc;
  }, {});

  return {
    inputs: {
      full_name: stringToField(credential.fullName),
      date_of_birth: credential.dateOfBirth,
      student_id: stringToField(credential.studentId),
      institution_name: stringToField(credential.institutionName),
      program: stringToField(credential.program),
      year_of_study: credential.yearOfStudy,
      student_status: credential.studentStatus === "active" ? 1 : 0,
      issue_date: credential.issueDate,
      expiry_date: credential.expiryDate,
      photo_hash: stringToField(credential.photoHash),
      credential_id: stringToField(credential.credentialId),
      holder_public_key: stringToField(credential.holderPublicKey),
      issuer_id: stringToField(credential.issuerId),
      nonce: stringToField(credential.nonce),
      salt: stringToField(credential.salt),
      signature: stringToField(credential.signature),
    },
    public_inputs: {
      credential_id: stringToField(credential.credentialId),
      commitment: hashToField(JSON.stringify(credential)),
      disclosed_fields_bitmap: 0, // Will be calculated
      issuer_public_key: stringToField(issuerPubKey),
      holder_public_key: stringToField(credential.holderPublicKey),
      age_over_18: predicates.age_over_18 || 0,
      year_valid: predicates.year_valid || 0,
      status_active: predicates.status_active || 0,
      current_timestamp: timestamp,
    },
  };
}

function prepareCollegeIDDisclosure(credential: any, scope: any) {
  const disclosedFields: Record<string, any> = {};
  let bitmap = 0;

  const fieldMap: Record<string, number> = {
    fullName: 0,
    institutionName: 1,
    program: 2,
    yearOfStudy: 3,
    studentStatus: 4,
  };

  scope.fields.forEach((field: string) => {
    if (field in fieldMap) {
      bitmap |= 1 << fieldMap[field];
      disclosedFields[field] = credential[field];
    }
  });

  return { disclosedFields, bitmap };
}

function prepareCitizenshipCardInputs(
  credential: any,
  scope: any,
  issuerPubKey: string,
  timestamp: number
) {
  const predicates = scope.predicates.reduce((acc: any, p: any) => {
    acc[p.type] = p.value !== undefined ? p.value : 1;
    return acc;
  }, {});

  return {
    inputs: {
      full_name: stringToField(credential.fullName),
      date_of_birth: credential.dateOfBirth,
      national_id_number: stringToField(credential.nationalIdNumber),
      nationality: stringToField(credential.nationality),
      place_of_birth: stringToField(credential.placeOfBirth),
      gender: stringToField(credential.gender),
      residential_address: stringToField(credential.residentialAddress),
      issue_date: credential.issueDate,
      expiry_date: credential.expiryDate,
      biometric_hash: stringToField(credential.biometricHash),
      photo_hash: stringToField(credential.photoHash),
      credential_id: stringToField(credential.credentialId),
      holder_public_key: stringToField(credential.holderPublicKey),
      issuing_authority: stringToField(credential.issuingAuthority),
      nonce: stringToField(credential.nonce),
      salt: stringToField(credential.salt),
      signature: stringToField(credential.signature),
      reserved: 0,
    },
  };
}

function prepareCitizenshipCardDisclosure(credential: any, scope: any) {
  const disclosedFields: Record<string, any> = {};
  let bitmap = 0;

  const fieldMap: Record<string, number> = {
    fullName: 0,
    nationality: 1,
    gender: 2,
    residentialAddress: 3,
  };

  scope.fields.forEach((field: string) => {
    if (field in fieldMap) {
      bitmap |= 1 << fieldMap[field];
      disclosedFields[field] = credential[field];
    }
  });

  return { disclosedFields, bitmap };
}

function prepareDriversLicenseInputs(
  credential: any,
  scope: any,
  issuerPubKey: string,
  timestamp: number
) {
  return {
    inputs: {
      full_name: stringToField(credential.fullName),
      date_of_birth: credential.dateOfBirth,
      license_number: stringToField(credential.licenseNumber),
      issuing_state_or_authority: stringToField(
        credential.issuingStateOrAuthority
      ),
      issue_date: credential.issueDate,
      expiry_date: credential.expiryDate,
      vehicle_class: stringToField(credential.vehicleClass),
      endorsements: stringToField(credential.endorsements),
      restrictions: stringToField(credential.restrictions),
      address: stringToField(credential.address),
      photo_hash: stringToField(credential.photoHash),
      credential_id: stringToField(credential.credentialId),
      holder_public_key: stringToField(credential.holderPublicKey),
      nonce: stringToField(credential.nonce),
      salt: stringToField(credential.salt),
      signature: stringToField(credential.signature),
    },
  };
}

function prepareDriversLicenseDisclosure(credential: any, scope: any) {
  const disclosedFields: Record<string, any> = {};
  let bitmap = 0;

  const fieldMap: Record<string, number> = {
    fullName: 0,
    licenseNumber: 1,
    vehicleClass: 2,
    restrictions: 3,
  };

  scope.fields.forEach((field: string) => {
    if (field in fieldMap) {
      bitmap |= 1 << fieldMap[field];
      disclosedFields[field] = credential[field];
    }
  });

  return { disclosedFields, bitmap };
}

function prepareVehicleRegistrationInputs(
  credential: any,
  scope: any,
  issuerPubKey: string,
  timestamp: number
) {
  return {
    inputs: {
      registration_number: stringToField(credential.registrationNumber),
      owner_name: stringToField(credential.ownerName),
      owner_public_key: stringToField(credential.ownerPublicKey),
      vehicle_vin: stringToField(credential.vehicleVIN),
      vehicle_make: stringToField(credential.vehicleMake),
      vehicle_model: stringToField(credential.vehicleModel),
      vehicle_year: credential.vehicleYear,
      engine_number: stringToField(credential.engineNumber),
      registration_date: credential.registrationDate,
      expiry_date: credential.expiryDate,
      insurance_policy_number: stringToField(credential.insurancePolicyNumber),
      issuing_authority: stringToField(credential.issuingAuthority),
      photo_hash: stringToField(credential.photoHash),
      credential_id: stringToField(credential.credentialId),
      nonce: stringToField(credential.nonce),
      salt: stringToField(credential.salt),
    },
  };
}

function prepareVehicleRegistrationDisclosure(credential: any, scope: any) {
  const disclosedFields: Record<string, any> = {};
  let bitmap = 0;

  const fieldMap: Record<string, number> = {
    registrationNumber: 0,
    ownerName: 1,
    vehicleMake: 2,
    vehicleModel: 3,
    vehicleYear: 4,
  };

  scope.fields.forEach((field: string) => {
    if (field in fieldMap) {
      bitmap |= 1 << fieldMap[field];
      disclosedFields[field] = credential[field];
    }
  });

  return { disclosedFields, bitmap };
}

