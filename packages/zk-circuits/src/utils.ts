import { createHash } from "crypto";

/**
 * Convert a string to a field element
 * In production, use proper field arithmetic
 */
export function stringToField(str: string): string {
  if (!str) return "0";
  
  // Simple hash to field conversion
  const hash = createHash("sha256").update(str).digest("hex");
  return BigInt("0x" + hash).toString();
}

/**
 * Hash data to a field element using SHA256
 * In production, use Poseidon hash for ZK-friendly hashing
 */
export function hashToField(data: string): string {
  const hash = createHash("sha256").update(data).digest("hex");
  return BigInt("0x" + hash).toString();
}

/**
 * Create a bitmap from an array of field names
 */
export function bitmapFromFields(
  selectedFields: string[],
  allFields: string[]
): number {
  let bitmap = 0;
  selectedFields.forEach((field) => {
    const index = allFields.indexOf(field);
    if (index !== -1) {
      bitmap |= 1 << index;
    }
  });
  return bitmap;
}

/**
 * Extract disclosed fields from bitmap
 */
export function fieldsFromBitmap(
  bitmap: number,
  allFields: string[]
): string[] {
  const disclosed: string[] = [];
  for (let i = 0; i < allFields.length; i++) {
    if ((bitmap & (1 << i)) !== 0) {
      disclosed.push(allFields[i]);
    }
  }
  return disclosed;
}

/**
 * Generate a random nonce
 */
export function generateNonce(): string {
  return createHash("sha256")
    .update(Date.now().toString() + Math.random().toString())
    .digest("hex");
}

/**
 * Generate a random salt
 */
export function generateSalt(): string {
  return createHash("sha256")
    .update(Math.random().toString() + Date.now().toString())
    .digest("hex");
}

/**
 * Calculate age from date of birth timestamp
 */
export function calculateAge(dateOfBirth: number): number {
  const now = Date.now();
  const ageInMs = now - dateOfBirth * 1000; // Assuming dob is in seconds
  return Math.floor(ageInMs / (1000 * 60 * 60 * 24 * 365.25));
}

/**
 * Check if credential is expired
 */
export function isExpired(expiryDate: number): boolean {
  return Date.now() / 1000 > expiryDate;
}

