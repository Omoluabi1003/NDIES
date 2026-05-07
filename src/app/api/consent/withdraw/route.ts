import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { apiError } from "@/lib/api-response";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const schema = z.object({ profileId: z.string().min(1), email: z.string().email(), reason: z.string().max(500).optional() });

export async function POST(req: NextRequest) {
  try {
    const input = schema.parse(await req.json());
    const prisma = getPrisma();
    const profile = await prisma.diasporaProfile.findFirst({ where: { id: input.profileId, email: input.email.toLowerCase() } });
    if (!profile) return NextResponse.json({ error: "Profile not found for this email" }, { status: 404 });

    await prisma.$transaction([
      prisma.consentRecord.updateMany({ where: { profileId: input.profileId, isWithdrawn: false }, data: { isWithdrawn: true, withdrawnAt: new Date(), withdrawalReason: input.reason || "User withdrew consent from dashboard" } }),
      prisma.diasporaProfile.update({ where: { id: input.profileId }, data: { consentStatus: "WITHDRAWN" } }),
    ]);

    return NextResponse.json({ data: { profileId: input.profileId, consentStatus: "WITHDRAWN" } });
  } catch (error) {
    return apiError(error, "Unable to withdraw consent");
  }
}
