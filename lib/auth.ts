import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

// Name of the cookie that holds the admin's login session.
export const SESSION_COOKIE = "admin_session";

// jose needs the secret as raw bytes, not a plain string.
function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not set in your .env file. Generate one with: openssl rand -base64 32");
  }
  return new TextEncoder().encode(secret);
}

// --- Password helpers (used when creating the admin user + checking login) ---

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

// --- Session token helpers (a signed JWT stored in an httpOnly cookie) ---
// We use "jose" instead of the more common "jsonwebtoken" package because jose
// works in Next.js Middleware (which runs on the lightweight "Edge" runtime),
// while jsonwebtoken does not.

export interface AdminSessionPayload {
  userId: string;
  email: string;
}

export async function createSessionToken(payload: AdminSessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // stays logged in for 7 days
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return { userId: payload.userId as string, email: payload.email as string };
  } catch {
    // Expired, tampered with, or signed with a different secret — treat as "not logged in".
    return null;
  }
}
