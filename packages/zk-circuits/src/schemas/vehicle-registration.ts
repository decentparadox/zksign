export const VEHICLE_REGISTRATION_FIELDS = [
  { name: "registrationNumber", label: "Registration Number", type: "string" },
  { name: "ownerName", label: "Owner Name", type: "string" },
  { name: "ownerPublicKey", label: "Owner Public Key", type: "string" },
  { name: "vehicleVIN", label: "Vehicle VIN", type: "string" },
  { name: "vehicleMake", label: "Vehicle Make", type: "string" },
  { name: "vehicleModel", label: "Vehicle Model", type: "string" },
  { name: "vehicleYear", label: "Vehicle Year", type: "number" },
  { name: "engineNumber", label: "Engine Number", type: "string" },
  { name: "registrationDate", label: "Registration Date", type: "timestamp" },
  { name: "expiryDate", label: "Expiry Date", type: "timestamp" },
  { name: "insurancePolicyNumber", label: "Insurance Policy Number", type: "string" },
  { name: "issuingAuthority", label: "Issuing Authority", type: "string" },
  { name: "photoHash", label: "Photo Hash", type: "string" },
  { name: "credentialId", label: "Credential ID", type: "string" },
  { name: "nonce", label: "Nonce", type: "string" },
  { name: "salt", label: "Salt", type: "string" },
] as const;

export const VEHICLE_REGISTRATION_PREDICATES = [
  { id: "registration_valid", label: "Registration Valid", description: "Prove registration is valid" },
  { id: "insurance_valid", label: "Insurance Valid", description: "Prove insurance policy exists" },
  { id: "year_range_check", label: "Year Range Check", description: "Prove vehicle year in range" },
] as const;

