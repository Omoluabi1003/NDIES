import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { apiError } from "@/lib/api-response";
import { getProfileById } from "@/lib/data-service";
import { getPrisma } from "@/lib/prisma";

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


const updateSchema = z.object({
  email: z.string().email(),
  city: z.string().min(2).optional(),
  country: z.string().min(2).optional(),
  sector: z.string().min(2).optional(),
  professionTitle: z.string().min(2).optional(),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
  skills: z.array(z.string()).optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const input = updateSchema.parse(await req.json());
    const prisma = getPrisma();
    const profile = await prisma.diasporaProfile.findFirst({ where: { id, email: input.email.toLowerCase(), consentStatus: "ACTIVE" } });
    if (!profile) return NextResponse.json({ error: "Active profile not found for this email" }, { status: 404 });
    const { email, ...data } = input;
    void email;
    const updated = await prisma.diasporaProfile.update({ where: { id }, data });
    return NextResponse.json({ data: updated });
  } catch (error) {
    return apiError(error, "Unable to update profile");
  }
}
