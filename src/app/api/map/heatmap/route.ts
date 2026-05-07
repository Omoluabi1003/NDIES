import { NextRequest, NextResponse } from "next/server";
import { apiError } from "@/lib/api-response";
import { getProfiles } from "@/lib/data-service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const layer = req.nextUrl.searchParams.get("layer") || "Talent Density";
    const profiles = await getProfiles();
    const points = profiles.map((p) => ({
      city: p.city,
      country: p.country,
      latitude: p.latitude,
      longitude: p.longitude,
      weight: layer.includes("Investment")
        ? p.investmentCapacityScore
        : layer.includes("Healthcare") && p.sector === "Healthcare"
          ? p.strategicValueIndex
          : layer.includes("Technology") && p.sector === "Technology"
            ? p.strategicValueIndex
            : layer.includes("Academic") && p.sector === "Academia"
              ? p.influenceScore
              : p.strategicValueIndex,
      sector: p.sector,
    }));
    return NextResponse.json({ layer, rendererPattern: "ArcGIS HeatmapRenderer", points });
  } catch (error) {
    return apiError(error, "Unable to load heatmap points");
  }
}
