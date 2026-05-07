import { NextRequest, NextResponse } from "next/server";
import { apiError } from "@/lib/api-response";
import { createProfile, getProfilesPage } from "@/lib/data-service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const s = req.nextUrl.searchParams;
    const result = await getProfilesPage(
      {
        country: s.get("country") || undefined,
        city: s.get("city") || undefined,
        sector: s.get("sector") || undefined,
        engagementCategory: s.get("engagementCategory") || undefined,
        query: s.get("query") || undefined,
      },
      {
        page: Number(s.get("page") || 1),
        pageSize: Number(s.get("pageSize") || 50),
      },
    );
    return NextResponse.json(result);
  } catch (error) {
    return apiError(error, "Unable to load profiles");
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await createProfile(body);
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return apiError(error, "Unable to create profile");
  }
}
