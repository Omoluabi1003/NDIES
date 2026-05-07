type PrismaLike = {
  diasporaProfile: { findMany(args?: unknown): Promise<unknown[]>; create(args: unknown): Promise<unknown>; deleteMany(): Promise<unknown>; createMany(args: unknown): Promise<unknown> };
  diasporaOrganization: { deleteMany(): Promise<unknown>; createMany(args: unknown): Promise<unknown> };
  engagementProgram: { findMany(): Promise<unknown[]>; deleteMany(): Promise<unknown>; createMany(args: unknown): Promise<unknown> };
  aIClassificationLog: { create(args: unknown): Promise<unknown>; deleteMany(): Promise<unknown> };
};
let cached: PrismaLike | null = null;
export async function getPrisma(): Promise<PrismaLike> {
  if (cached) return cached;
  const mod = await import("@prisma/client");
  const client = new mod.PrismaClient() as PrismaLike;
  cached = client;
  return client;
}
