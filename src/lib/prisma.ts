import { PrismaClient } from "@prisma/client";
import { requireDatabase } from "./runtime";

type Delegate = {
  findMany(args?: unknown): Promise<unknown[]>;
  findUnique(args: unknown): Promise<unknown | null>;
  count(args?: unknown): Promise<number>;
  create(args: unknown): Promise<unknown>;
  deleteMany(args?: unknown): Promise<unknown>;
  createMany(args: unknown): Promise<unknown>;
};

type PrismaClientLike = PrismaClient & {
  diasporaProfile: Delegate;
  diasporaOrganization: Delegate;
  engagementProgram: Delegate;
  aIClassificationLog: Delegate;
};

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClientLike };

export function getPrisma(): PrismaClientLike {
  requireDatabase();

  const client =
    globalForPrisma.prisma ??
    (new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    }) as PrismaClientLike);

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }

  return client;
}
