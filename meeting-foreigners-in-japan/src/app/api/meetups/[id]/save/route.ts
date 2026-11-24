import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { savedMeetups } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { and, eq } from "drizzle-orm";

export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to save meetups." },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const meetupId = Number(id);

    const [existing] = await db
      .select()
      .from(savedMeetups)
      .where(
        and(
          eq(savedMeetups.meetupId, meetupId),
          eq(savedMeetups.userId, user.id)
        )
      )
      .limit(1);

    if (existing) {
      await db.delete(savedMeetups).where(eq(savedMeetups.id, existing.id));
      return NextResponse.json({ saved: false });
    }

    await db.insert(savedMeetups).values({ meetupId, userId: user.id });
    return NextResponse.json({ saved: true });
  } catch (err) {
    console.error("POST /api/meetups/[id]/save error:", err);
    return NextResponse.json(
      { error: "Unable to toggle save." },
      { status: 500 }
    );
  }
}
