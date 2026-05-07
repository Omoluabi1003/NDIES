import { NextRequest, NextResponse } from "next/server";
import { apiError } from "@/lib/api-response";
import { getPrisma } from "@/lib/prisma";
import { approximateCoordinates, CONSENT_VERSION, consentStatements, enrollmentSchema, engagementCategoryForSector, normalizeSector, PRIVACY_POLICY_URL, splitSkills, TERMS_URL } from "@/lib/enrollment";
import { sendEnrollmentVerificationEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

function getClientIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: NextRequest) {
  try {
    const input = enrollmentSchema.parse(await req.json());
    const prisma = getPrisma();
    const sector = normalizeSector(input.sector || "Other");
    const coords = approximateCoordinates(input.country);
    const token = crypto.randomUUID();
    const now = new Date();

    const profile = await prisma.$transaction(async (tx) => {
      const created = await tx.diasporaProfile.create({
        data: {
          fullName: input.fullName,
          dateOfBirth: new Date(input.dateOfBirth),
          gender: input.gender,
          email: input.email.toLowerCase(),
          phone: input.phone,
          country: input.country,
          city: input.city,
          latitude: coords.latitude,
          longitude: coords.longitude,
          sector,
          professionTitle: input.currentRole || "Voluntary enrollee",
          organization: "Self-enrolled NDIES profile",
          linkedinUrl: input.linkedinUrl || null,
          portfolioUrl: input.portfolioUrl || null,
          skills: splitSkills(input.skills),
          influenceScore: 50,
          investmentCapacityScore: 50,
          strategicValueIndex: 50,
          engagementCategory: engagementCategoryForSector(sector),
          sourceType: "VOLUNTARY_OPT_IN",
          consentStatus: "ACTIVE",
          emailVerificationToken: token,
          enrollmentSource: "PUBLIC_ENROLLMENT_WIZARD",
          consentRecords: {
            create: {
              consentVersion: CONSENT_VERSION,
              consentedAt: now,
              ipAddress: getClientIp(req),
              userAgent: req.headers.get("user-agent") || "unknown",
              lawfulPurpose: "Lawful diaspora engagement, diaspora mapping, and national development programming under explicit voluntary opt-in consent.",
              privacyPolicyUrl: PRIVACY_POLICY_URL,
              termsUrl: TERMS_URL,
              consentText: [...consentStatements],
            },
          },
        },
      });
      return created;
    });

    await sendEnrollmentVerificationEmail({ email: input.email.toLowerCase(), fullName: input.fullName, token, profileId: profile.id });

    return NextResponse.json({ data: { id: profile.id, email: profile.email, consentStatus: profile.consentStatus, emailVerificationRequired: true } }, { status: 201 });
  } catch (error) {
    return apiError(error, "Unable to complete voluntary enrollment");
  }
}
