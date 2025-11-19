import { createHash, randomBytes, createCipheriv, createDecipheriv } from "crypto";

/**
 * Encrypt credential data with holder's public key
 * Simplified encryption - in production use proper asymmetric encryption
 */
export function encryptCredential(data: string, publicKey: string): string {
  try {
    // Derive encryption key from public key (simplified)
    const key = createHash("sha256").update(publicKey).digest();
    const iv = randomBytes(16);

    const cipher = createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");

    // Prepend IV to encrypted data
    return iv.toString("hex") + ":" + encrypted;
  } catch (error) {
    console.error("Encryption failed:", error);
    throw new Error("Failed to encrypt credential");
  }
}

/**
 * Decrypt credential data with holder's private key
 * Simplified decryption - in production use proper asymmetric decryption
 */
export function decryptCredential(encryptedData: string, publicKey: string): string {
  try {
    // Split IV and encrypted data
    const parts = encryptedData.split(":");
    if (parts.length !== 2) {
      throw new Error("Invalid encrypted data format");
    }

    const iv = Buffer.from(parts[0], "hex");
    const encrypted = parts[1];

    // Derive decryption key from public key
    const key = createHash("sha256").update(publicKey).digest();

    const decipher = createDecipheriv("aes-256-cbc", key, iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Failed to decrypt credential");
  }
}

