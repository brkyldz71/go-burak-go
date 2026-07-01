import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

function getConnectionString(): string | undefined {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_URL_NON_POOLING
  );
}

function createPool(): Pool {
  const connectionString = getConnectionString();
  if (!connectionString) {
    throw new Error("DATABASE_URL or POSTGRES_URL is required");
  }
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

let _pool: Pool | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

function getPool(): Pool {
  if (!_pool) {
    if (globalForDb.__arenaNextJsPostgresqlPool) {
      _pool = globalForDb.__arenaNextJsPostgresqlPool;
    } else {
      _pool = createPool();
      if (process.env.NODE_ENV !== "production") {
        globalForDb.__arenaNextJsPostgresqlPool = _pool;
      }
    }
  }
  return _pool;
}

export const pool = new Proxy({} as Pool, {
  get(_target, prop) {
    const p = getPool();
    const value = (p as unknown as Record<string | symbol, unknown>)[prop];
    return typeof value === "function" ? value.bind(p) : value;
  },
});

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    if (!_db) {
      _db = drizzle(getPool());
    }
    const value = (_db as unknown as Record<string | symbol, unknown>)[prop];
    return typeof value === "function" ? value.bind(_db) : value;
  },
});
