import { readDataFile, writeDataFile } from "@/lib/server/storage";
import crypto from "node:crypto";

export type UserRole = "admin" | "customer";

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  phone?: string;
  company?: string;
  role: UserRole;
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
  updatedAt: string;
}

interface UsersFileShape {
  users: UserRecord[];
}

const USERS_FILE = "users.json";
const DEFAULT_USERS_FILE: UsersFileShape = { users: [] };

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

export async function getAllUsers(): Promise<UserRecord[]> {
  const file = await readDataFile<UsersFileShape>(USERS_FILE, DEFAULT_USERS_FILE);
  return Array.isArray(file.users) ? file.users : [];
}

async function saveAllUsers(users: UserRecord[]): Promise<void> {
  await writeDataFile(USERS_FILE, { users } satisfies UsersFileShape);
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const users = await getAllUsers();
  const normalized = normalizeEmail(email);
  return users.find((u) => normalizeEmail(u.email) === normalized) ?? null;
}

export async function findUserById(id: string): Promise<UserRecord | null> {
  const users = await getAllUsers();
  return users.find((u) => u.id === id) ?? null;
}

export async function createUser(input: {
  email: string;
  name: string;
  phone?: string;
  company?: string;
  passwordHash: string;
  passwordSalt: string;
  role: UserRole;
}): Promise<UserRecord> {
  const users = await getAllUsers();
  const now = new Date().toISOString();
  const user: UserRecord = {
    id: `usr_${crypto.randomUUID()}`,
    email: input.email.trim(),
    name: input.name.trim(),
    phone: input.phone?.trim() || undefined,
    company: input.company?.trim() || undefined,
    role: input.role,
    passwordHash: input.passwordHash,
    passwordSalt: input.passwordSalt,
    createdAt: now,
    updatedAt: now,
  };
  users.push(user);
  await saveAllUsers(users);
  return user;
}

export async function updateUser(
  userId: string,
  patch: Partial<Pick<UserRecord, "name" | "phone" | "company" | "email" | "role">>
): Promise<UserRecord | null> {
  const users = await getAllUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return null;
  const now = new Date().toISOString();
  const next: UserRecord = {
    ...users[idx],
    ...patch,
    updatedAt: now,
  };
  users[idx] = next;
  await saveAllUsers(users);
  return next;
}


