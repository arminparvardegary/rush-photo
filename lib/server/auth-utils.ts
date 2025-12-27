import { hash, compare } from "bcryptjs";

export async function hashPassword(password: string): Promise<string> {
    return await hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return await compare(password, hash);
}

export const SESSION_COOKIE_NAME = "rush_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days
