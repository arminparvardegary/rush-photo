import { supabase } from "@/lib/supabase";
import crypto from "node:crypto";

export type UserRole = "admin" | "customer";

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  phone?: string;
  company?: string;
  role: UserRole;
  passwordHash?: string;
  passwordSalt?: string;
  // OAuth fields
  googleId?: string;
  avatarUrl?: string;
  authProvider: "email" | "google";
  createdAt: string;
  updatedAt: string;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isAdminEmail(email: string): boolean {
  const list = process.env.ADMIN_EMAILS;
  if (!list) return false;
  const normalized = normalizeEmail(email);
  const allowed = list
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(normalized);
}

// Map Supabase 'users' table row to UserRecord
function mapUser(row: any): UserRecord {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    phone: row.phone || undefined,
    company: row.company || undefined,
    role: isAdminEmail(row.email) ? "admin" : "customer", // Role derived from env
    passwordHash: row.password || undefined,
    passwordSalt: undefined, // We don't use salt with bcryptjs usually if stored in 'password'
    googleId: row.google_id || undefined,
    avatarUrl: row.image || undefined,
    authProvider: row.google_id ? "google" : "email",
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

export async function getAllUsers(): Promise<UserRecord[]> {
  const { data, error } = await supabase.from("users").select("*");
  if (error) {
    console.error("Supabase Error (getAllUsers):", error);
    return [];
  }
  return (data || []).map(mapUser);
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const normalized = normalizeEmail(email);
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", normalized)
    .maybeSingle();

  if (error) console.error("Supabase Error (findUserByEmail):", error);
  if (!data) return null;
  return mapUser(data);
}

export async function findUserById(id: string): Promise<UserRecord | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return mapUser(data);
}

export async function createUser(input: {
  email: string;
  name: string;
  phone?: string;
  company?: string;
  passwordHash?: string;
  passwordSalt?: string;
  role: UserRole;
  googleId?: string;
  avatarUrl?: string;
  authProvider: "email" | "google";
}): Promise<UserRecord> {
  // We insert into users table
  const insertData = {
    email: normalizeEmail(input.email),
    name: input.name,
    password: input.passwordHash || null,
    image: input.avatarUrl || null,
    phone: input.phone || null,
    company: input.company || null,
    google_id: input.googleId || null,
    // created_at defaults to now
  };

  const { data, error } = await supabase
    .from("users")
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error("Create User Error:", error);
    throw new Error(error.message);
  }

  return mapUser(data);
}

export async function findUserByGoogleId(googleId: string): Promise<UserRecord | null> {
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("google_id", googleId)
    .maybeSingle();

  return data ? mapUser(data) : null;
}

export async function findOrCreateGoogleUser(profile: {
  googleId: string;
  email: string;
  name: string;
  avatarUrl?: string;
}): Promise<UserRecord> {
  // 1. Check by google_id
  let user = await findUserByGoogleId(profile.googleId);
  if (user) return user;

  // 2. Check by email
  const existingByEmail = await findUserByEmail(profile.email);
  if (existingByEmail) {
    // Update google_id
    await updateUser(existingByEmail.id, { googleId: profile.googleId, avatarUrl: profile.avatarUrl });
    return { ...existingByEmail, googleId: profile.googleId, avatarUrl: profile.avatarUrl };
  }

  // 3. Create
  return createUser({
    email: profile.email,
    name: profile.name,
    googleId: profile.googleId,
    avatarUrl: profile.avatarUrl,
    authProvider: "google",
    role: isAdminEmail(profile.email) ? "admin" : "customer",
  });
}

export async function updateUser(
  userId: string,
  patch: Partial<Pick<UserRecord, "name" | "phone" | "company" | "email" | "role" | "passwordHash" | "googleId" | "avatarUrl">>
): Promise<UserRecord | null> {
  const updateData: any = {};
  if (patch.name !== undefined) updateData.name = patch.name;
  if (patch.phone !== undefined) updateData.phone = patch.phone;
  if (patch.company !== undefined) updateData.company = patch.company;
  if (patch.email !== undefined) updateData.email = normalizeEmail(patch.email);
  if (patch.passwordHash !== undefined) updateData.password = patch.passwordHash;
  if (patch.googleId !== undefined) updateData.google_id = patch.googleId;
  if (patch.avatarUrl !== undefined) updateData.image = patch.avatarUrl;

  updateData.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("users")
    .update(updateData)
    .eq("id", userId)
    .select()
    .single();

  if (error || !data) return null;
  return mapUser(data);
}

// Reset Tokens (Placeholder)
export async function createPasswordResetToken(email: string): Promise<string | null> {
  console.log("Reset password requested for", email, "(Not fully implemented in DB yet)");
  return "demo-token";
}

export async function verifyPasswordResetToken(token: string): Promise<string | null> {
  return null;
}

export async function resetPassword(token: string, newPassword: string): Promise<boolean> {
  return false;
}
