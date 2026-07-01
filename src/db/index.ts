import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
  __arenaNextJsDrizzle?: ReturnType<typeof drizzle>;
};

// Build sırasında patlamaması için varsayılan değer
const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  "postgresql://build:build@localhost:5432/build";

function createPool(): Pool {
  return new Pool({
    connectionString,
    ssl:
      connectionString.includes("neon") ||
      connectionString.includes("vercel") ||
      connectionString.includes("supabase") ||
      connectionString.includes("render")
        ? { rejectUnauthorized: false }
        : undefined,
  });
}

function getPool(): Pool {
  if (!globalForDb.__arenaNextJsPostgresqlPool) {
    globalForDb.__arenaNextJsPostgresqlPool = createPool();
  }
  return globalForDb.__arenaNextJsPostgresqlPool;
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    if (!globalForDb.__arenaNextJsDrizzle) {
      globalForDb.__arenaNextJsDrizzle = drizzle(getPool());
    }
    const value = (
      globalForDb.__arenaNextJsDrizzle as unknown as Record<string | symbol, unknown>
    )[prop];
    return typeof value === "function" ? value.bind(globalForDb.__arenaNextJsDrizzle) : value;
  },
});
