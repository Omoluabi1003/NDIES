import { NextRequest, NextResponse } from "next/server";
import { createProfile, getProfiles } from "@/lib/data-service";
export async function GET(req: NextRequest){ const s=req.nextUrl.searchParams; const data=await getProfiles({country:s.get("country")||undefined,city:s.get("city")||undefined,sector:s.get("sector")||undefined,engagementCategory:s.get("engagementCategory")||undefined}); return NextResponse.json({data}); }
export async function POST(req: NextRequest){ const body=await req.json(); const data=await createProfile(body); return NextResponse.json({data},{status:201}); }
