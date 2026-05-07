import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { apiError } from "@/lib/api-response";
import { createProfile, getProfilesPage } from "@/lib/data-service";
import type { DiasporaProfile } from "@/lib/types";

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

const consentProofSchema = z.object({
  consentProof: z.object({
    consentVersion: z.string().min(1),
    consentedAt: z.string().datetime().or(z.date()),
    consentStatementsAccepted: z.array(z.string()).min(4),
    lawfulPurposeAccepted: z.literal(true),
  }),
}).passthrough();

export async function POST(req: NextRequest) {
  try {
    const body = consentProofSchema.parse(await req.json());
    const { consentProof, ...profileInput } = body;
    void consentProof;
    const profileData = profileInput as Omit<DiasporaProfile, "id"> & { id?: string };
    const data = await createProfile({ ...profileData, consentStatus: profileData.consentStatus || "ACTIVE" });
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return apiError(error, "Unable to create profile. Explicit NDPA 2023 opt-in consent proof is required.");
  }
}
