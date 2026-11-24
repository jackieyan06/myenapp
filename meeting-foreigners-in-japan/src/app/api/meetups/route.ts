import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { meetups } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { getMeetupsWithMeta } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city") ?? undefined;
    const category = searchParams.get("category") ?? undefined;
    const languageFocus = searchParams.get("languageFocus") ?? undefined;
    const search = searchParams.get("search") ?? undefined;
    const openOnly = searchParams.get("openOnly") === "true";

    const list = await getMeetupsWithMeta({
      city,
      category,
      languageFocus,
      search,
      openOnly,
      viewerId: user?.id ?? null,
    });

    return NextResponse.json({ meetups: list });
  } catch (err) {
    console.error("GET /api/meetups error:", err);
    return NextResponse.json(
      { error: "Unable to load meetups." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to host a meetup." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const title = String(body.title ?? "").trim();
    const titleJp = String(body.titleJp ?? "").trim();
    const category = String(body.category ?? "").trim();
    const city = String(body.city ?? "").trim();
    const neighborhood = String(body.neighborhood ?? "").trim();
    const station = String(body.station ?? "").trim();
    const venueName = String(body.venueName ?? "").trim();
    const meetingPoint = String(body.meetingPoint ?? "").trim();
    const startsAtRaw = String(body.startsAt ?? "").trim();
    const durationMinutes = Number(body.durationMinutes ?? 120);
    const maxAttendees = Number(body.maxAttendees ?? 8);
    const costNote = String(
      body.costNote ?? "Free · Order your own drink"
    ).trim();
    const languageFocus = String(
      body.languageFocus ?? "Bilingual EN / JP"
    ).trim();
    const languageLevel = String(
      body.languageLevel ?? "All Levels Welcome"
    ).trim();
    const description = String(body.description ?? "").trim();
    const coverImage = String(
      body.coverImage ?? "/images/meetup-language-shibuya.jpg"
    ).trim();
    const tags = Array.isArray(body.tags)
      ? body.tags.map((t: unknown) => String(t).trim()).filter(Boolean)
      : [];

    if (!title || title.length < 5) {
      return NextResponse.json(
        { error: "Please provide a descriptive title (at least 5 characters)." },
        { status: 400 }
      );
    }
    if (!category || !city || !neighborhood || !station || !venueName) {
      return NextResponse.json(
        {
          error:
            "City, category, neighborhood, nearest train station, and venue are required.",
        },
        { status: 400 }
      );
    }
    if (!description || description.length < 20) {
      return NextResponse.json(
        {
          error:
            "Please write a helpful description (at least 20 characters) so guests know what to expect.",
        },
        { status: 400 }
      );
    }

    const startsAt = new Date(startsAtRaw);
    if (Number.isNaN(startsAt.getTime())) {
      return NextResponse.json(
        { error: "Please select a valid date and time." },
        { status: 400 }
      );
    }

    const clampedCapacity = Math.max(2, Math.min(30, maxAttendees || 8));
    const clampedDuration = Math.max(30, Math.min(480, durationMinutes || 120));

    const [created] = await db
      .insert(meetups)
      .values({
        hostId: user.id,
        title,
        titleJp,
        category,
        city,
        neighborhood,
        station,
        venueName,
        meetingPoint,
        startsAt,
        durationMinutes: clampedDuration,
        maxAttendees: clampedCapacity,
        costNote,
        languageFocus,
        languageLevel,
        description,
        tags,
        coverImage: coverImage || "/images/meetup-language-shibuya.jpg",
        status: "upcoming",
      })
      .returning();

    return NextResponse.json({ meetup: created }, { status: 201 });
  } catch (err) {
    console.error("POST /api/meetups error:", err);
    return NextResponse.json(
      { error: "Unable to create meetup." },
      { status: 500 }
    );
  }
}
