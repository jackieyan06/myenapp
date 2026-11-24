import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { meetups } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { getMeetupDetail } from "@/lib/queries";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const meetupId = Number(id);
    if (!Number.isInteger(meetupId) || meetupId <= 0) {
      return NextResponse.json({ error: "Invalid meetup ID" }, { status: 400 });
    }
    const user = await getCurrentUser();
    const detail = await getMeetupDetail(meetupId, user?.id ?? null);
    if (!detail) {
      return NextResponse.json({ error: "Meetup not found" }, { status: 404 });
    }
    return NextResponse.json({ meetup: detail });
  } catch (err) {
    console.error("GET /api/meetups/[id] error:", err);
    return NextResponse.json(
      { error: "Unable to load meetup details" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Please sign in" }, { status: 401 });
    }
    const { id } = await context.params;
    const meetupId = Number(id);

    const [existing] = await db
      .select()
      .from(meetups)
      .where(eq(meetups.id, meetupId))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: "Meetup not found" }, { status: 404 });
    }
    if (existing.hostId !== user.id) {
      return NextResponse.json(
        { error: "Only the host can edit this meetup." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const startsAt = body.startsAt
      ? new Date(String(body.startsAt))
      : existing.startsAt;
    if (Number.isNaN(startsAt.getTime())) {
      return NextResponse.json(
        { error: "Invalid date and time." },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(meetups)
      .set({
        title: body.title ? String(body.title).trim() : existing.title,
        titleJp:
          body.titleJp !== undefined
            ? String(body.titleJp).trim()
            : existing.titleJp,
        venueName: body.venueName
          ? String(body.venueName).trim()
          : existing.venueName,
        station: body.station ? String(body.station).trim() : existing.station,
        meetingPoint:
          body.meetingPoint !== undefined
            ? String(body.meetingPoint).trim()
            : existing.meetingPoint,
        costNote: body.costNote
          ? String(body.costNote).trim()
          : existing.costNote,
        maxAttendees: body.maxAttendees
          ? Math.max(2, Math.min(30, Number(body.maxAttendees)))
          : existing.maxAttendees,
        description: body.description
          ? String(body.description).trim()
          : existing.description,
        startsAt,
      })
      .where(eq(meetups.id, meetupId))
      .returning();

    return NextResponse.json({ meetup: updated });
  } catch (err) {
    console.error("PATCH /api/meetups/[id] error:", err);
    return NextResponse.json(
      { error: "Unable to update meetup." },
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
      return NextResponse.json({ error: "Please sign in" }, { status: 401 });
    }
    const { id } = await context.params;
    const meetupId = Number(id);

    const [existing] = await db
      .select()
      .from(meetups)
      .where(eq(meetups.id, meetupId))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: "Meetup not found" }, { status: 404 });
    }
    if (existing.hostId !== user.id) {
      return NextResponse.json(
        { error: "Only the host can delete this meetup." },
        { status: 403 }
      );
    }

    await db.delete(meetups).where(eq(meetups.id, meetupId));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/meetups/[id] error:", err);
    return NextResponse.json(
      { error: "Unable to delete meetup." },
      { status: 500 }
    );
  }
}
