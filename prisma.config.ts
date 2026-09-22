import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * Prisma CLI configuration (Prisma ORM 7).
 *
 * The runtime connection for Prisma Client is created in `lib/db.ts` via the
 * `@prisma/adapter-pg` driver adapter. This file configures the CLI — mainly
 * `prisma migrate deploy` (used in the Vercel build to keep the database
 * schema in sync) and `prisma migrate dev` during local development.
 */
const databaseUrl = process.env.DATABASE_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // Required for Migrate / introspection commands. Optional for `prisma generate`.
  ...(databaseUrl ? { datasource: { url: databaseUrl } } : {}),
});
