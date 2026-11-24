import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { connections, users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { getUserHubData } from "@/lib/queries";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Please sign in." }, { status: 401 });
    }
    const hub = await getUserHubData(user.id);
    return NextResponse.json({ connections: hub.connections });
  } catch (err) {
    console.error("GET /api/connections error:", err);
    return NextResponse.json(
      { error: "Unable to load connections." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to send a coffee chat invite." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const receiverId = Number(body.receiverId);
    const message = String(body.message ?? "").trim();
    const meetupContext = String(
      body.meetupContext ?? "Coffee & Language Chat"
    ).trim();

    if (!receiverId || receiverId === user.id) {
      return NextResponse.json(
        { error: "Please choose another community member." },
        { status: 400 }
      );
    }
    if (!message || message.length < 5) {
      return NextResponse.json(
        { error: "Please include a friendly short message (at least 5 characters)." },
        { status: 400 }
      );
    }

    const [receiver] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, receiverId))
      .limit(1);
    if (!receiver) {
      return NextResponse.json({ error: "Member not found." }, { status: 404 });
    }

    const [created] = await db
      .insert(connections)
      .values({
        senderId: user.id,
        receiverId,
        message,
        meetupContext,
        status: "pending",
      })
      .returning();

    return NextResponse.json({ connection: created }, { status: 201 });
  } catch (err) {
    console.error("POST /api/connections error:", err);
    return NextResponse.json(
      { error: "Unable to send invite." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Please sign in." }, { status: 401 });
    }

    const body = await request.json();
    const connectionId = Number(body.connectionId);
    const status = String(body.status ?? "");

    if (!["accepted", "declined"].includes(status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }

    const [existing] = await db
      .select()
      .from(connections)
      .where(eq(connections.id, connectionId))
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { error: "Invite not found." },
        { status: 404 }
      );
    }
    if (existing.receiverId !== user.id) {
      return NextResponse.json(
        { error: "Only the recipient can respond to this invite." },
        { status: 403 }
      );
    }

    const [updated] = await db
      .update(connections)
      .set({ status })
      .where(eq(connections.id, connectionId))
      .returning();

    return NextResponse.json({ connection: updated });
  } catch (err) {
    console.error("PATCH /api/connections error:", err);
    return NextResponse.json(
      { error: "Unable to update invite." },
      { status: 500 }
    );
  }
}
