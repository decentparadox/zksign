export const DRIVERS_LICENSE_FIELDS = [
  { name: "fullName", label: "Full Name", type: "string" },
  { name: "dateOfBirth", label: "Date of Birth", type: "timestamp" },
  { name: "licenseNumber", label: "License Number", type: "string" },
  { name: "issuingStateOrAuthority", label: "Issuing State/Authority", type: "string" },
  { name: "issueDate", label: "Issue Date", type: "timestamp" },
  { name: "expiryDate", label: "Expiry Date", type: "timestamp" },
  { name: "vehicleClass", label: "Vehicle Class", type: "string" },
  { name: "endorsements", label: "Endorsements", type: "string" },
  { name: "restrictions", label: "Restrictions", type: "string" },
  { name: "address", label: "Address", type: "string" },
  { name: "photoHash", label: "Photo Hash", type: "string" },
  { name: "credentialId", label: "Credential ID", type: "string" },
  { name: "holderPublicKey", label: "Holder Public Key", type: "string" },
  { name: "nonce", label: "Nonce", type: "string" },
  { name: "salt", label: "Salt", type: "string" },
  { name: "signature", label: "Signature", type: "string" },
] as const;

export const DRIVERS_LICENSE_PREDICATES = [
  { id: "age_over_18", label: "Age >= 18", description: "Prove holder is 18 or older" },
  { id: "age_over_21", label: "Age >= 21", description: "Prove holder is 21 or older" },
  { id: "class_match", label: "Class Match", description: "Prove specific vehicle class" },
  { id: "not_expired", label: "Not Expired", description: "Prove license is not expired" },
] as const;

