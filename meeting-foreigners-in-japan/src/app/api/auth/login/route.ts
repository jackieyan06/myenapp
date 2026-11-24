import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { verifyPassword, setSessionCookie, toPublicUser } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    await ensureSeeded();
    const body = await request.json();
    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();
    const password = String(body.password ?? "");
    const demoMode = Boolean(body.demo);

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: "No account found with that email." },
        { status: 401 }
      );
    }

    // Allow 1-click demo personas ONLY for the seeded @en-japan.jp accounts
    if (demoMode && email.endsWith("@en-japan.jp")) {
      await setSessionCookie(user.id);
      return NextResponse.json({ user: toPublicUser(user) });
    }

    if (!password || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json(
        { error: "Incorrect email or password." },
        { status: 401 }
      );
    }

    await setSessionCookie(user.id);
    return NextResponse.json({ user: toPublicUser(user) });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Unable to sign in right now." },
      { status: 500 }
    );
  }
}
