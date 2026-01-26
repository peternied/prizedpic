import { PrismaClient } from "../lib/generated/prisma";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

console.log("[Prisma] prisma config file present?", !!process.env.PRISMA_CONFIG_PATH);
console.log("[Prisma] engine env:", {
  PRISMA_CLIENT_ENGINE_TYPE: process.env.PRISMA_CLIENT_ENGINE_TYPE,
  PRISMA_GENERATE_DATAPROXY: process.env.PRISMA_GENERATE_DATAPROXY,
  PRISMA_DISABLE_ENGINE: process.env.PRISMA_DISABLE_ENGINE,
});

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? [
            { level: "query", emit: "event" },
            { level: "error", emit: "stdout" },
            { level: "warn", emit: "stdout" },
          ]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
