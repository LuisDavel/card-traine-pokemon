import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2";
import * as schema from "./schema";

function createPool() {
  return mysql.createPool({
    uri: process.env.DATABASE_URL!,
    waitForConnections: true,
    connectionLimit: 10,
    connectTimeout: 10000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
  });
}

const globalForDb = globalThis as unknown as {
  pool: ReturnType<typeof mysql.createPool> | undefined;
};

const pool = globalForDb.pool ?? createPool();

if (process.env.NODE_ENV !== "production") {
  globalForDb.pool = pool;
}

export const db = drizzle(pool, { schema, mode: "default" });
