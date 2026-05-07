import { NextResponse } from "next/server";
import { apiError } from "@/lib/api-response";
import { getProfiles } from "@/lib/data-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const profiles = await getProfiles();
    const grouped = profiles.reduce<Record<string, typeof profiles>>((a, p) => {
      const key = `${p.city}, ${p.country}`;
      (a[key] ||= []).push(p);
      return a;
    }, {});
    const features = Object.entries(grouped).map(([name, items], i) => {
      const first = items[0];
      return {
        type: "Feature",
        id: i,
        geometry: { type: "Point", coordinates: [first.longitude, first.latitude] },
        properties: {
          name,
          city: first.city,
          country: first.country,
          count: items.length,
          avgInfluence: Math.round(items.reduce((s, p) => s + p.influenceScore, 0) / items.length),
          avgInvestment: Math.round(items.reduce((s, p) => s + p.investmentCapacityScore, 0) / items.length),
          avgStrategicValue: Math.round(items.reduce((s, p) => s + p.strategicValueIndex, 0) / items.length),
          sectors: [...new Set(items.map((p) => p.sector))],
          profiles: items,
        },
      };
    });
    return NextResponse.json({ type: "FeatureCollection", features });
  } catch (error) {
    return apiError(error, "Unable to load diaspora map points");
  }
}
