import { getPrisma } from "./prisma";
import { canUseDemoFallback } from "./runtime";
import { profiles as sampleProfiles, programs as samplePrograms } from "./sample-data";
import type { DiasporaProfile, EngagementProgram } from "./types";

export type ProfileFilters = {
  country?: string;
  city?: string;
  sector?: string;
  engagementCategory?: string;
  query?: string;
};

export type PaginationInput = {
  page?: number;
  pageSize?: number;
};

export type PaginatedProfiles = {
  data: DiasporaProfile[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  source: "database" | "development-demo";
};

const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 100;

function normalizePagination(input?: PaginationInput) {
  const page = Math.max(1, Number(input?.page) || 1);
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, Number(input?.pageSize) || DEFAULT_PAGE_SIZE));
  return { page, pageSize, skip: (page - 1) * pageSize };
}

function buildWhere(filters?: ProfileFilters) {
  const where: Record<string, unknown> = {};
  if (filters?.country) where.country = filters.country;
  if (filters?.city) where.city = filters.city;
  if (filters?.sector) where.sector = filters.sector;
  if (filters?.engagementCategory) where.engagementCategory = filters.engagementCategory;
  if (filters?.query) {
    where.OR = [
      { fullName: { contains: filters.query, mode: "insensitive" } },
      { organization: { contains: filters.query, mode: "insensitive" } },
      { professionTitle: { contains: filters.query, mode: "insensitive" } },
      { skills: { has: filters.query } },
    ];
  }
  return where;
}

function filterDemoProfiles(filters?: ProfileFilters) {
  const query = filters?.query?.toLowerCase();
  return sampleProfiles.filter(
    (p) =>
      (!filters?.country || p.country === filters.country) &&
      (!filters?.city || p.city === filters.city) &&
      (!filters?.sector || p.sector === filters.sector) &&
      (!filters?.engagementCategory || p.engagementCategory === filters.engagementCategory) &&
      (!query ||
        p.fullName.toLowerCase().includes(query) ||
        p.organization.toLowerCase().includes(query) ||
        p.professionTitle.toLowerCase().includes(query) ||
        p.skills.some((skill) => skill.toLowerCase().includes(query))),
  );
}

export async function getProfiles(filters?: ProfileFilters): Promise<DiasporaProfile[]> {
  const result = await getProfilesPage(filters, { page: 1, pageSize: MAX_PAGE_SIZE });
  return result.data;
}

export async function getProfilesPage(filters?: ProfileFilters, pagination?: PaginationInput): Promise<PaginatedProfiles> {
  const { page, pageSize, skip } = normalizePagination(pagination);

  try {
    const prisma = getPrisma();
    const where = buildWhere(filters);
    const [data, total] = await Promise.all([
      prisma.diasporaProfile.findMany({
        where,
        orderBy: [{ strategicValueIndex: "desc" }, { updatedAt: "desc" }],
        skip,
        take: pageSize,
      }),
      prisma.diasporaProfile.count({ where }),
    ]);

    return {
      data: data as DiasporaProfile[],
      pagination: { page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) },
      source: "database",
    };
  } catch (error) {
    if (!canUseDemoFallback) throw error;

    const filtered = filterDemoProfiles(filters);
    const data = filtered.slice(skip, skip + pageSize);
    return {
      data,
      pagination: { page, pageSize, total: filtered.length, totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)) },
      source: "development-demo",
    };
  }
}

export async function createProfile(data: Omit<DiasporaProfile, "id"> & { id?: string }) {
  try {
    const prisma = getPrisma();
    return await prisma.diasporaProfile.create({ data });
  } catch (error) {
    if (!canUseDemoFallback) throw error;
    return { ...data, id: data.id ?? crypto.randomUUID() };
  }
}

export async function getProfileById(id: string) {
  try {
    const prisma = getPrisma();
    return (await prisma.diasporaProfile.findUnique({ where: { id } })) as DiasporaProfile | null;
  } catch (error) {
    if (!canUseDemoFallback) throw error;
    return sampleProfiles.find((p) => p.id === id) ?? null;
  }
}

export async function getPrograms(): Promise<EngagementProgram[]> {
  try {
    const prisma = getPrisma();
    return (await prisma.engagementProgram.findMany({ orderBy: { title: "asc" } })) as EngagementProgram[];
  } catch (error) {
    if (!canUseDemoFallback) throw error;
    return samplePrograms;
  }
}

export function metricsFor(data: DiasporaProfile[]) {
  const countries = new Set(data.map((p) => p.country));
  const sectorCounts = data.reduce<Record<string, number>>((a, p) => {
    a[p.sector] = (a[p.sector] || 0) + 1;
    return a;
  }, {});
  const avg = (k: keyof Pick<DiasporaProfile, "investmentCapacityScore" | "strategicValueIndex" | "influenceScore">) =>
    Math.round(data.reduce((s, p) => s + (p[k] as number), 0) / Math.max(data.length, 1));
  return {
    estimatedDiasporaProfiles: data.length,
    countriesRepresented: countries.size,
    topProfessionalSectors: Object.entries(sectorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([sector, count]) => ({ sector, count })),
    investmentOpportunityIndex: avg("investmentCapacityScore"),
    engagementReadinessScore: avg("strategicValueIndex"),
    averageInfluenceScore: avg("influenceScore"),
  };
}
