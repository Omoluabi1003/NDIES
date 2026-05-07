import { getPrisma } from "./prisma";
import { profiles as sampleProfiles, programs as samplePrograms } from "./sample-data";
import type { DiasporaProfile, EngagementProgram } from "./types";
export async function getProfiles(filters?: Record<string,string|undefined>): Promise<DiasporaProfile[]> {
  try {
    const where: Record<string, unknown> = {};
    if(filters?.country) where.country = filters.country;
    if(filters?.city) where.city = filters.city;
    if(filters?.sector) where.sector = filters.sector;
    if(filters?.engagementCategory) where.engagementCategory = filters.engagementCategory;
    const prisma = await getPrisma();
    return await prisma.diasporaProfile.findMany({ where, orderBy: { strategicValueIndex: "desc" }}) as DiasporaProfile[];
  } catch { return sampleProfiles.filter(p=>(!filters?.country||p.country===filters.country)&&(!filters?.city||p.city===filters.city)&&(!filters?.sector||p.sector===filters.sector)&&(!filters?.engagementCategory||p.engagementCategory===filters.engagementCategory)); }
}
export async function createProfile(data: DiasporaProfile) { try { const prisma = await getPrisma(); return await prisma.diasporaProfile.create({ data }); } catch { return { ...data, id: crypto.randomUUID() }; } }
export async function getPrograms(): Promise<EngagementProgram[]> { try { const prisma = await getPrisma(); return await prisma.engagementProgram.findMany() as EngagementProgram[]; } catch { return samplePrograms; } }
export function metricsFor(data: DiasporaProfile[]) { const countries=new Set(data.map(p=>p.country)); const sectorCounts=data.reduce<Record<string,number>>((a,p)=>{a[p.sector]=(a[p.sector]||0)+1;return a},{}); const avg=(k:keyof Pick<DiasporaProfile,"investmentCapacityScore"|"strategicValueIndex"|"influenceScore">)=>Math.round(data.reduce((s,p)=>s+(p[k] as number),0)/Math.max(data.length,1)); return {estimatedDiasporaProfiles:data.length,countriesRepresented:countries.size,topProfessionalSectors:Object.entries(sectorCounts).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([sector,count])=>({sector,count})),investmentOpportunityIndex:avg("investmentCapacityScore"),engagementReadinessScore:avg("strategicValueIndex"),averageInfluenceScore:avg("influenceScore")}; }
