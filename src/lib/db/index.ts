import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2";
import * as schema from "./schema";

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL!,
  waitForConnections: true,
  connectionLimit: 10,
  connectTimeout: 10000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
});

export const db = drizzle(pool, { schema, mode: "default" });
