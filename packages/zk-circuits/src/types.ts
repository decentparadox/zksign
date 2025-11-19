// Type definitions for all four credential types

export type CredentialType =
  | "college-id"
  | "citizenship-card"
  | "drivers-license"
  | "vehicle-registration";

// College ID Credential
export interface CollegeIDCredential {
  fullName: string;
  dateOfBirth: number; // timestamp
  studentId: string;
  institutionName: string;
  program: string;
  yearOfStudy: number;
  studentStatus: "active" | "inactive";
  issueDate: number;
  expiryDate: number;
  photoHash: string;
  credentialId: string;
  holderPublicKey: string;
  issuerId: string;
  nonce: string;
  salt: string;
  signature: string;
}

// Citizenship Card Credential
export interface CitizenshipCardCredential {
  fullName: string;
  dateOfBirth: number;
  nationalIdNumber: string;
  nationality: string;
  placeOfBirth: string;
  gender: "male" | "female" | "other";
  residentialAddress: string;
  issueDate: number;
  expiryDate: number;
  biometricHash: string;
  photoHash: string;
  credentialId: string;
  holderPublicKey: string;
  issuingAuthority: string;
  nonce: string;
  salt: string;
  signature: string;
}

// Driver's License Credential
export interface DriversLicenseCredential {
  fullName: string;
  dateOfBirth: number;
  licenseNumber: string;
  issuingStateOrAuthority: string;
  issueDate: number;
  expiryDate: number;
  vehicleClass: string;
  endorsements: string;
  restrictions: string;
  address: string;
  photoHash: string;
  credentialId: string;
  holderPublicKey: string;
  nonce: string;
  salt: string;
  signature: string;
}

// Vehicle Registration Credential
export interface VehicleRegistrationCredential {
  registrationNumber: string;
  ownerName: string;
  ownerPublicKey: string;
  vehicleVIN: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  engineNumber: string;
  registrationDate: number;
  expiryDate: number;
  insurancePolicyNumber: string;
  issuingAuthority: string;
  photoHash: string;
  credentialId: string;
  nonce: string;
  salt: string;
}

export type Credential =
  | CollegeIDCredential
  | CitizenshipCardCredential
  | DriversLicenseCredential
  | VehicleRegistrationCredential;

// Disclosure scope - which fields to reveal
export interface DisclosureScope {
  fields: string[]; // Array of field names to disclose
  predicates: PredicateConfig[];
}

export interface PredicateConfig {
  type:
    | "age_over_18"
    | "age_over_21"
    | "year_valid"
    | "status_active"
    | "nationality_match"
    | "not_expired"
    | "class_match"
    | "registration_valid"
    | "insurance_valid"
    | "year_range_check";
  value?: any; // Optional value for predicate (e.g., nationality to match)
}

// ZK Proof structure
export interface ZKProof {
  proof: Uint8Array;
  publicInputs: string[];
  credentialType: CredentialType;
  disclosedFields: Record<string, any>;
  verifierContractAddress: string;
}

// Proof generation inputs
export interface ProofGenerationInput {
  credentialType: CredentialType;
  credential: Credential;
  disclosureScope: DisclosureScope;
  issuerPublicKey: string;
  currentTimestamp: number;
}

// Compiled circuit structure
export interface CompiledCircuit {
  circuit: any; // Noir circuit object
  abi: any; // Circuit ABI
}

