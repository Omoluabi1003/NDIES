import { NextRequest, NextResponse } from "next/server";
import { getProfiles } from "@/lib/data-service";
export async function GET(_req: NextRequest,{params}:{params:Promise<{id:string}>}){ const {id}=await params; const data=(await getProfiles()).find(p=>p.id===id); return data?NextResponse.json({data}):NextResponse.json({error:"Profile not found"},{status:404}); }
