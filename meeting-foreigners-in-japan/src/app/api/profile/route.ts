import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, type UserLanguage } from "@/db/schema";
import { getCurrentUser, toPublicUser } from "@/lib/auth";
import { NATIONALITIES } from "@/lib/constants";
import { eq } from "drizzle-orm";

export async function PATCH(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
    }

    const body = await request.json();
    const name = String(body.name ?? currentUser.name).trim();
    const roleLabel = String(body.roleLabel ?? currentUser.roleLabel).trim();
    const nationality = String(
      body.nationality ?? currentUser.nationality
    ).trim();
    const foundNat = NATIONALITIES.find((n) => n.name === nationality);
    const nationalityFlag =
      String(body.nationalityFlag ?? "").trim() ||
      foundNat?.flag ||
      currentUser.nationalityFlag;
    const homeCity = String(body.homeCity ?? currentUser.homeCity).trim();
    const neighborhood = String(
      body.neighborhood ?? currentUser.neighborhood
    ).trim();
    const bio = String(body.bio ?? currentUser.bio).trim();
    const openToCoffee =
      typeof body.openToCoffee === "boolean"
        ? body.openToCoffee
        : currentUser.openToCoffee;

    const languages: UserLanguage[] = Array.isArray(body.languages)
      ? body.languages
          .filter((l: unknown) => l && typeof l === "object" && "lang" in l)
          .map((l: { lang?: string; level?: string }) => ({
            lang: String(l.lang ?? "").trim(),
            level: String(l.level ?? "Conversational").trim(),
          }))
          .filter((l: UserLanguage) => l.lang.length > 0)
      : currentUser.languages;

    const interests: string[] = Array.isArray(body.interests)
      ? body.interests.map((i: unknown) => String(i).trim()).filter(Boolean)
      : currentUser.interests;

    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters." },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(users)
      .set({
        name,
        roleLabel,
        nationality,
        nationalityFlag,
        homeCity,
        neighborhood,
        languages,
        interests,
        bio,
        openToCoffee,
      })
      .where(eq(users.id, currentUser.id))
      .returning();

    return NextResponse.json({ user: toPublicUser(updated) });
  } catch (err) {
    console.error("Update profile error:", err);
    return NextResponse.json(
      { error: "Unable to update profile." },
      { status: 500 }
    );
  }
}
