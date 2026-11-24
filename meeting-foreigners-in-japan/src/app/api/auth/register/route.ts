import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, type UserLanguage } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { hashPassword, setSessionCookie, toPublicUser } from "@/lib/auth";
import { NATIONALITIES } from "@/lib/constants";
import { eq } from "drizzle-orm";

const AVATAR_PALETTE = [
  "#D94E34",
  "#2B4C7E",
  "#3E6B48",
  "#D98A2B",
  "#7B4B94",
  "#1F7A8C",
  "#B84A62",
];

export async function POST(request: NextRequest) {
  try {
    await ensureSeeded();
    const body = await request.json();

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();
    const password = String(body.password ?? "");
    const roleLabel = String(body.roleLabel ?? "Expat in Japan").trim();
    const nationality = String(body.nationality ?? "United States").trim();
    const homeCity = String(body.homeCity ?? "Tokyo").trim();
    const neighborhood = String(body.neighborhood ?? "").trim();
    const bio = String(body.bio ?? "").trim();
    const languagesInput = Array.isArray(body.languages) ? body.languages : [];
    const interestsInput = Array.isArray(body.interests) ? body.interests : [];

    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: "Please enter your name (at least 2 characters)." },
        { status: 400 }
      );
    }
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }
    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const foundNat = NATIONALITIES.find((n) => n.name === nationality);
    const nationalityFlag =
      String(body.nationalityFlag ?? "").trim() || foundNat?.flag || "🌏";

    const languages: UserLanguage[] =
      languagesInput.length > 0
        ? languagesInput
            .filter((l: unknown) => l && typeof l === "object" && "lang" in l)
            .map((l: { lang?: string; level?: string }) => ({
              lang: String(l.lang ?? "").trim(),
              level: String(l.level ?? "Conversational").trim(),
            }))
            .filter((l: UserLanguage) => l.lang.length > 0)
        : [
            { lang: "English", level: "Fluent" },
            { lang: "Japanese", level: "Beginner" },
          ];

    const interests: string[] = interestsInput
      .map((i: unknown) => String(i).trim())
      .filter(Boolean);

    const avatarColor =
      AVATAR_PALETTE[Math.floor(Math.random() * AVATAR_PALETTE.length)];

    const [created] = await db
      .insert(users)
      .values({
        email,
        passwordHash: hashPassword(password),
        name,
        roleLabel,
        nationality,
        nationalityFlag,
        homeCity,
        neighborhood,
        languages,
        interests:
          interests.length > 0
            ? interests
            : ["Coffee & Café", "Cultural Exchange"],
        bio:
          bio ||
          `Excited to meet international friends and locals around ${homeCity}!`,
        avatarColor,
        isVerified: true,
        openToCoffee: true,
      })
      .returning();

    await setSessionCookie(created.id);
    return NextResponse.json({ user: toPublicUser(created) }, { status: 201 });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json(
      { error: "Unable to create account." },
      { status: 500 }
    );
  }
}
