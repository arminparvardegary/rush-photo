import crypto from "node:crypto";
import type { UserRecord } from "@/lib/server/users";

export const SESSION_COOKIE_NAME = "rp_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

export interface SessionPayload {
  sub: string;
  role: UserRecord["role"];
  email: string;
  name: string;
  exp: number; // unix seconds
}

function getAuthSecret(): string {
  return process.env.AUTH_SECRET || "dev-auth-secret-change-me";
}

function base64UrlEncode(input: string | Buffer): string {
  const buf = typeof input === "string" ? Buffer.from(input, "utf8") : input;
  return buf
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(input: string): string {
  const pad = input.length % 4;
  const padded = input + (pad ? "=".repeat(4 - pad) : "");
  const normalized = padded.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(normalized, "base64").toString("utf8");
}

function sign(data: string): string {
  const h = crypto.createHmac("sha256", getAuthSecret());
  h.update(data);
  return base64UrlEncode(h.digest());
}

export function createSessionToken(user: UserRecord): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    sub: user.id,
    role: user.role,
    email: user.email,
    name: user.name,
    exp: now + SESSION_MAX_AGE_SECONDS,
  };
  const raw = JSON.stringify(payload);
  const body = base64UrlEncode(raw);
  const sig = sign(body);
  return `${body}.${sig}`;
}

export function verifySessionToken(token: string | undefined | null): SessionPayload | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  const expected = sign(body);
  // constant-time-ish compare
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return null;
  if (!crypto.timingSafeEqual(a, b)) return null;
  const decoded = base64UrlDecode(body);
  let payload: SessionPayload;
  try {
    payload = JSON.parse(decoded) as SessionPayload;
  } catch {
    return null;
  }
  const now = Math.floor(Date.now() / 1000);
  if (!payload?.sub || !payload?.exp || payload.exp < now) return null;
  return payload;
}

export async function hashPassword(password: string): Promise<{ salt: string; hash: string }> {
  const salt = crypto.randomBytes(16);
  const derived = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, key) => {
      if (err) reject(err);
      else resolve(key as Buffer);
    });
  });
  return {
    salt: salt.toString("base64"),
    hash: derived.toString("base64"),
  };
}

export async function verifyPassword(password: string, saltB64: string, hashB64: string): Promise<boolean> {
  const salt = Buffer.from(saltB64, "base64");
  const expected = Buffer.from(hashB64, "base64");
  const derived = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, expected.length, (err, key) => {
      if (err) reject(err);
      else resolve(key as Buffer);
    });
  });
  if (derived.length !== expected.length) return false;
  return crypto.timingSafeEqual(derived, expected);
}


