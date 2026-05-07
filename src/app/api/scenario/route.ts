import { NextRequest, NextResponse } from "next/server";
import { apiError } from "@/lib/api-response";
import { getProfiles } from "@/lib/data-service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { targetCountry, targetSector, goal } = await req.json();
    const profiles = (await getProfiles()).filter((p) => (!targetCountry || p.country === targetCountry) && (!targetSector || p.sector === targetSector));
    const byCity = profiles.reduce<Record<string, { score: number; count: number; city: string; country: string }>>((a, p) => {
      const k = `${p.city}, ${p.country}`;
      a[k] ||= { score: 0, count: 0, city: p.city, country: p.country };
      a[k].score += p.strategicValueIndex + p.investmentCapacityScore;
      a[k].count++;
      return a;
    }, {});
    const priorityCities = Object.values(byCity)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((c) => ({ city: c.city, country: c.country, priorityScore: Math.round(c.score / (c.count * 2)), profileCount: c.count }));
    return NextResponse.json({
      priorityCities,
      engagementStrategy: `Launch a ${goal || "strategic"} mission focused on ${targetSector || "multi-sector"} leaders in ${targetCountry || "priority diaspora markets"}, anchored by verified associations, senior champions, and measurable follow-up commitments.`,
      expectedValue: "Qualified partner pipeline, sector intelligence, investment or skills-transfer leads, and city-level engagement targets within 90 days.",
      riskFlags: [
        "Consent and data provenance must be verified before outreach.",
        "AI scores require human review before policy or funding decisions.",
        "Diaspora fatigue risk if engagement is not matched with concrete opportunities.",
      ],
      recommendedNextAction: "Convene a virtual roundtable with the top city cluster and validate participant interest through the voluntary registry.",
    });
  } catch (error) {
    return apiError(error, "Unable to generate scenario plan");
  }
}
