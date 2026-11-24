import { cookies } from "next/headers";
import crypto from "crypto";
import { db } from "@/db";
import { users, type UserLanguage } from "@/db/schema";
import { eq } from "drizzle-orm";

const COOKIE_NAME = "en_japan_session";
const SECRET =
  process.env.AUTH_SECRET ||
  process.env.SESSION_SECRET ||
  "en-japan-meetup-session-secret-2026";

export interface PublicUser {
  id: number;
  email: string;
  name: string;
  roleLabel: string;
  nationality: string;
  nationalityFlag: string;
  homeCity: string;
  neighborhood: string;
  languages: UserLanguage[];
  interests: string[];
  bio: string;
  avatarColor: string;
  isVerified: boolean;
  openToCoffee: boolean;
  createdAt: Date;
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const computed = crypto.scryptSync(password, salt, 64);
  const storedBuf = Buffer.from(hash, "hex");
  if (computed.length !== storedBuf.length) return false;
  return crypto.timingSafeEqual(computed, storedBuf);
}

export function signSessionToken(userId: number): string {
  const exp = Date.now() + 1000 * 60 * 60 * 24 * 14; // 14 days
  const payload = Buffer.from(JSON.stringify({ userId, exp })).toString(
    "base64url"
  );
  const sig = crypto
    .createHmac("sha256", SECRET)
    .update(payload)
    .digest("base64url");
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string): { userId: number } | null {
  try {
    const [payload, sig] = token.split(".");
    if (!payload || !sig) return null;
    const expected = crypto
      .createHmac("sha256", SECRET)
      .update(payload)
      .digest("base64url");
    if (
      expected.length !== sig.length ||
      !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))
    ) {
      return null;
    }
    const decoded = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    ) as { userId: number; exp: number };
    if (!decoded.userId || decoded.exp < Date.now()) return null;
    return { userId: decoded.userId };
  } catch {
    return null;
  }
}

export async function setSessionCookie(userId: number) {
  const token = signSessionToken(userId);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export function toPublicUser(row: typeof users.$inferSelect): PublicUser {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    roleLabel: row.roleLabel,
    nationality: row.nationality,
    nationalityFlag: row.nationalityFlag,
    homeCity: row.homeCity,
    neighborhood: row.neighborhood,
    languages: row.languages ?? [],
    interests: row.interests ?? [],
    bio: row.bio,
    avatarColor: row.avatarColor,
    isVerified: row.isVerified,
    openToCoffee: row.openToCoffee,
    createdAt: row.createdAt,
  };
}

export async function getCurrentUser(): Promise<PublicUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    const verified = verifySessionToken(token);
    if (!verified) return null;
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, verified.userId))
      .limit(1);
    if (!user) return null;
    return toPublicUser(user);
  } catch {
    return null;
  }
}
