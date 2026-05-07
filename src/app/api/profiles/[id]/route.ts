import { NextRequest, NextResponse } from "next/server";
import { apiError } from "@/lib/api-response";
import { getProfileById } from "@/lib/data-service";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await getProfileById(id);
    return data ? NextResponse.json({ data }) : NextResponse.json({ error: "Profile not found" }, { status: 404 });
  } catch (error) {
    return apiError(error, "Unable to load profile");
  }
}
