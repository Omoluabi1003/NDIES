import { NextRequest, NextResponse } from "next/server";
import { apiError } from "@/lib/api-response";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const profileId = req.nextUrl.searchParams.get("profileId");
    const token = req.nextUrl.searchParams.get("token");
    if (!profileId || !token) return NextResponse.json({ error: "Missing verification token" }, { status: 400 });

    const prisma = getPrisma();
    const profile = await prisma.diasporaProfile.findFirst({ where: { id: profileId, emailVerificationToken: token } });
    if (!profile) return NextResponse.json({ error: "Invalid or expired verification token" }, { status: 404 });

    await prisma.diasporaProfile.update({ where: { id: profileId }, data: { emailVerifiedAt: new Date(), emailVerificationToken: null } });
    return NextResponse.redirect(new URL(`/enroll/success?profileId=${encodeURIComponent(profileId)}&verified=1`, req.url));
  } catch (error) {
    return apiError(error, "Unable to verify enrollment email");
  }
}
