import crypto from 'crypto';

// Deterministic Master Key Pair for Offline Ed25519 Verification
// Generated from SHA-256 seed to ensure consistency between server issuer and client verifiers
const SEED = Buffer.from('ayato-studio-master-offline-license-signing-seed-2026-secure-ed25519-entropy');
const hash = crypto.createHash('sha256').update(SEED).digest();

// Construct Ed25519 PKCS8 private key with standard DER prefix
const PKCS8_PREFIX = Buffer.from('302e020100300506032b657004220420', 'hex');
const PRIVATE_KEY_DER = Buffer.concat([PKCS8_PREFIX, hash]);

const privateKey = crypto.createPrivateKey({
  key: PRIVATE_KEY_DER,
  format: 'der',
  type: 'pkcs8',
});

const publicKey = crypto.createPublicKey(privateKey);
export const PUBLIC_KEY_HEX = publicKey.export({ format: 'der', type: 'spki' }).toString('hex');
export const RAW_PUBLIC_KEY_HEX = PUBLIC_KEY_HEX.slice(-64); // Last 32 bytes (raw Ed25519 public key)

export interface LicensePayload {
  product: string;
  email: string;
  planId: string;
  tierName: string;
  issuedAt: string;
  expiresAt: string | null;
}

/**
 * Generates an offline verifiable cryptographic license key signed with Ed25519
 */
export function generateLicenseKey(payload: LicensePayload): string {
  const jsonStr = JSON.stringify(payload);
  const payloadB64 = Buffer.from(jsonStr, 'utf-8').toString('base64url');

  const signature = crypto.sign(null, Buffer.from(payloadB64, 'utf-8'), privateKey);
  const signatureB64 = signature.toString('base64url');

  return `AYATO-${payload.product.toUpperCase().replace(/-/g, '_')}.${payloadB64}.${signatureB64}`;
}

/**
 * Verifies an offline license key using the public key
 */
export function verifyLicenseKey(licenseKeyStr: string): { valid: boolean; payload?: LicensePayload } {
  try {
    const parts = licenseKeyStr.split('.');
    if (parts.length !== 3) return { valid: false };

    const [, payloadB64, signatureB64] = parts;
    const payloadBytes = Buffer.from(payloadB64, 'base64url');
    const signature = Buffer.from(signatureB64, 'base64url');

    const isVerified = crypto.verify(null, Buffer.from(payloadB64, 'utf-8'), publicKey, signature);
    if (!isVerified) return { valid: false };

    const payload: LicensePayload = JSON.parse(payloadBytes.toString('utf-8'));
    return { valid: true, payload };
  } catch (error) {
    return { valid: false };
  }
}
