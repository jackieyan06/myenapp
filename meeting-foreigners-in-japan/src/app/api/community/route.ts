import { NextRequest, NextResponse } from "next/server";
import { getCommunityMembers } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city") ?? undefined;
    const roleLabel = searchParams.get("roleLabel") ?? undefined;
    const search = searchParams.get("search") ?? undefined;

    const members = await getCommunityMembers({ city, roleLabel, search });
    return NextResponse.json({ members });
  } catch (err) {
    console.error("GET /api/community error:", err);
    return NextResponse.json(
      { error: "Unable to load community directory." },
      { status: 500 }
    );
  }
}
