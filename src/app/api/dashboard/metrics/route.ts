import { NextResponse } from "next/server";
import { getProfiles, metricsFor } from "@/lib/data-service";
export async function GET(){ const profiles=await getProfiles(); return NextResponse.json({data:metricsFor(profiles)}); }
