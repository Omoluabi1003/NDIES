import { NextResponse } from "next/server";
import { getPrograms } from "@/lib/data-service";
export async function GET(){ return NextResponse.json({data:await getPrograms()}); }
