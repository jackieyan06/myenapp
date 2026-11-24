import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { comments, meetups } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to post in the discussion." },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const meetupId = Number(id);
    const body = await request.json();
    const content = String(body.content ?? "").trim();

    if (!content || content.length < 2) {
      return NextResponse.json(
        { error: "Message cannot be empty." },
        { status: 400 }
      );
    }

    const [meetup] = await db
      .select()
      .from(meetups)
      .where(eq(meetups.id, meetupId))
      .limit(1);
    if (!meetup) {
      return NextResponse.json({ error: "Meetup not found." }, { status: 404 });
    }

    const [created] = await db
      .insert(comments)
      .values({
        meetupId,
        userId: user.id,
        content,
        isPinned: false,
      })
      .returning();

    return NextResponse.json(
      {
        comment: {
          id: created.id,
          meetupId: created.meetupId,
          userId: created.userId,
          userName: user.name,
          userFlag: user.nationalityFlag,
          userRole: user.roleLabel,
          userColor: user.avatarColor,
          isHost: meetup.hostId === user.id,
          content: created.content,
          isPinned: created.isPinned,
          createdAt: created.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/meetups/[id]/comments error:", err);
    return NextResponse.json(
      { error: "Unable to post comment." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Please sign in." }, { status: 401 });
    }

    const { id } = await context.params;
    const meetupId = Number(id);
    const { searchParams } = new URL(request.url);
    const commentId = Number(searchParams.get("commentId"));

    const [comment] = await db
      .select()
      .from(comments)
      .where(eq(comments.id, commentId))
      .limit(1);
    if (!comment || comment.meetupId !== meetupId) {
      return NextResponse.json(
        { error: "Comment not found." },
        { status: 404 }
      );
    }

    const [meetup] = await db
      .select()
      .from(meetups)
      .where(eq(meetups.id, meetupId))
      .limit(1);

    if (comment.userId !== user.id && meetup?.hostId !== user.id) {
      return NextResponse.json(
        { error: "Not authorized to delete this message." },
        { status: 403 }
      );
    }

    await db.delete(comments).where(eq(comments.id, commentId));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE comment error:", err);
    return NextResponse.json(
      { error: "Unable to delete comment." },
      { status: 500 }
    );
  }
}
