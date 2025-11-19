export const COLLEGE_ID_FIELDS = [
  { name: "fullName", label: "Full Name", type: "string" },
  { name: "dateOfBirth", label: "Date of Birth", type: "timestamp" },
  { name: "studentId", label: "Student ID", type: "string" },
  { name: "institutionName", label: "Institution Name", type: "string" },
  { name: "program", label: "Program", type: "string" },
  { name: "yearOfStudy", label: "Year of Study", type: "number" },
  { name: "studentStatus", label: "Student Status", type: "enum", values: ["active", "inactive"] },
  { name: "issueDate", label: "Issue Date", type: "timestamp" },
  { name: "expiryDate", label: "Expiry Date", type: "timestamp" },
  { name: "photoHash", label: "Photo Hash", type: "string" },
  { name: "credentialId", label: "Credential ID", type: "string" },
  { name: "holderPublicKey", label: "Holder Public Key", type: "string" },
  { name: "issuerId", label: "Issuer ID", type: "string" },
  { name: "nonce", label: "Nonce", type: "string" },
  { name: "salt", label: "Salt", type: "string" },
  { name: "signature", label: "Signature", type: "string" },
] as const;

export const COLLEGE_ID_PREDICATES = [
  { id: "age_over_18", label: "Age >= 18", description: "Prove holder is 18 or older" },
  { id: "year_valid", label: "Year Valid (1-4)", description: "Prove year of study is between 1-4" },
  { id: "status_active", label: "Active Status", description: "Prove student status is active" },
] as const;

