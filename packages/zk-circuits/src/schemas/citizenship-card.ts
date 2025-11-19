export const CITIZENSHIP_CARD_FIELDS = [
  { name: "fullName", label: "Full Name", type: "string" },
  { name: "dateOfBirth", label: "Date of Birth", type: "timestamp" },
  { name: "nationalIdNumber", label: "National ID Number", type: "string" },
  { name: "nationality", label: "Nationality", type: "string" },
  { name: "placeOfBirth", label: "Place of Birth", type: "string" },
  { name: "gender", label: "Gender", type: "enum", values: ["male", "female", "other"] },
  { name: "residentialAddress", label: "Residential Address", type: "string" },
  { name: "issueDate", label: "Issue Date", type: "timestamp" },
  { name: "expiryDate", label: "Expiry Date", type: "timestamp" },
  { name: "biometricHash", label: "Biometric Hash", type: "string" },
  { name: "photoHash", label: "Photo Hash", type: "string" },
  { name: "credentialId", label: "Credential ID", type: "string" },
  { name: "holderPublicKey", label: "Holder Public Key", type: "string" },
  { name: "issuingAuthority", label: "Issuing Authority", type: "string" },
  { name: "nonce", label: "Nonce", type: "string" },
  { name: "salt", label: "Salt", type: "string" },
  { name: "signature", label: "Signature", type: "string" },
] as const;

export const CITIZENSHIP_CARD_PREDICATES = [
  { id: "age_over_18", label: "Age >= 18", description: "Prove holder is 18 or older" },
  { id: "age_over_21", label: "Age >= 21", description: "Prove holder is 21 or older" },
  { id: "nationality_match", label: "Nationality Check", description: "Prove specific nationality" },
  { id: "not_expired", label: "Not Expired", description: "Prove credential is not expired" },
] as const;

