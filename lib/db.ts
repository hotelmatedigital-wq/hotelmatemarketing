import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

/**
 * Prisma client for the Hotel Mate Marketing Panel.
 *
 * Production persistence for Vercel: connects to PostgreSQL (Neon, Supabase,
 * or any managed Postgres) through the `@prisma/adapter-pg` driver adapter.
 * The connection string is read from `DATABASE_URL` and must never be exposed
 * to the browser — this module is server-only.
 */
const globalForPrisma = globalThis as unknown as { prismaClient?: PrismaClient };

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add your PostgreSQL connection string " +
        "(Neon / Supabase / any Postgres) to the environment to enable " +
        "persistent lead storage. See README.md → “Production database”."
    );
  }
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: url }),
  });
}

export const prisma = globalForPrisma.prismaClient ?? createPrismaClient();

// Reuse the client across hot reloads in development.
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaClient = prisma;
}
