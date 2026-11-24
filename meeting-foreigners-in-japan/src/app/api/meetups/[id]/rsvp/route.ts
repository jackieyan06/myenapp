import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { meetups, rsvps } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { and, asc, eq } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to RSVP for this meetup." },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const meetupId = Number(id);

    const [meetup] = await db
      .select()
      .from(meetups)
      .where(eq(meetups.id, meetupId))
      .limit(1);

    if (!meetup || meetup.status !== "upcoming") {
      return NextResponse.json(
        { error: "Meetup not found or no longer accepting RSVPs." },
        { status: 404 }
      );
    }

    if (meetup.hostId === user.id) {
      return NextResponse.json(
        { error: "You are already hosting this meetup!" },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const introNote = String(body.introNote ?? "").trim();
    const speakingLanguage =
      String(body.speakingLanguage ?? "").trim() ||
      user.languages.map((l) => l.lang).slice(0, 2).join(" / ");

    const currentRsvps = await db
      .select()
      .from(rsvps)
      .where(eq(rsvps.meetupId, meetupId));

    const existing = currentRsvps.find((r) => r.userId === user.id);
    const goingCount =
      currentRsvps.filter((r) => r.status === "going").length + 1; // +1 for host

    let targetStatus: "going" | "waitlist" = "going";
    if (existing?.status === "going") {
      targetStatus = "going";
    } else if (goingCount >= meetup.maxAttendees) {
      targetStatus = "waitlist";
    }

    if (existing) {
      const [updated] = await db
        .update(rsvps)
        .set({
          status: targetStatus,
          introNote,
          speakingLanguage,
        })
        .where(eq(rsvps.id, existing.id))
        .returning();
      return NextResponse.json({ rsvp: updated, status: targetStatus });
    }

    const [created] = await db
      .insert(rsvps)
      .values({
        meetupId,
        userId: user.id,
        status: targetStatus,
        introNote,
        speakingLanguage,
      })
      .returning();

    return NextResponse.json(
      { rsvp: created, status: targetStatus },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/meetups/[id]/rsvp error:", err);
    return NextResponse.json(
      { error: "Unable to process RSVP." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Please sign in." }, { status: 401 });
    }

    const { id } = await context.params;
    const meetupId = Number(id);

    const [existing] = await db
      .select()
      .from(rsvps)
      .where(and(eq(rsvps.meetupId, meetupId), eq(rsvps.userId, user.id)))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ ok: true });
    }

    const wasGoing = existing.status === "going";
    await db.delete(rsvps).where(eq(rsvps.id, existing.id));

    // Automatically promote earliest waitlisted guest if a confirmed spot opened
    if (wasGoing) {
      const [nextWaitlisted] = await db
        .select()
        .from(rsvps)
        .where(
          and(eq(rsvps.meetupId, meetupId), eq(rsvps.status, "waitlist"))
        )
        .orderBy(asc(rsvps.createdAt))
        .limit(1);

      if (nextWaitlisted) {
        await db
          .update(rsvps)
          .set({ status: "going" })
          .where(eq(rsvps.id, nextWaitlisted.id));
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/meetups/[id]/rsvp error:", err);
    return NextResponse.json(
      { error: "Unable to cancel RSVP." },
      { status: 500 }
    );
  }
}
