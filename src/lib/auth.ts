import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { env } from './env';

// Encode the JWT secret key to Uint8Array for jose compatibility
const SECRET_KEY = new TextEncoder().encode(env.JWT_SECRET);

/**
 * Hashes a plaintext password using bcryptjs.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Compares a plaintext password against a stored bcrypt hash.
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generates a signed JWT with a 7-day expiration time.
 */
export async function signJWT(payload: { userId: string; email: string }): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // 7 days expiration
    .sign(SECRET_KEY);
}

/**
 * Decrypts and verifies a JWT token. Returns payload or null if invalid.
 */
export async function verifyJWT(token: string): Promise<{ userId: string; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as { userId: string; email: string };
  } catch (error) {
    return null;
  }
}
