import { NextResponse } from "next/server";
import { apiError } from "@/lib/api-response";
import { getPrograms } from "@/lib/data-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json({ data: await getPrograms() });
  } catch (error) {
    return apiError(error, "Unable to load engagement recommendations");
  }
}
