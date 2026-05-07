import { NextResponse } from "next/server";
import { apiError } from "@/lib/api-response";
import { getProfiles, metricsFor } from "@/lib/data-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const profiles = await getProfiles();
    return NextResponse.json({ data: metricsFor(profiles) });
  } catch (error) {
    return apiError(error, "Unable to load dashboard metrics");
  }
}
