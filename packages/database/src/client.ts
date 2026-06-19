import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../generated/prisma/client.ts";

// Load .env from multiple locations (try root first)
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });
const _moduleDir = import.meta.dirname
  ?? path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(_moduleDir, "../../../.env") });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

// Resolve relative paths from the packages/database directory
const currentDir = path.resolve(_moduleDir);
const parentDir = path.resolve(currentDir, "..");
const dbDir = path.basename(parentDir) === "dist"
  ? path.resolve(parentDir, "..")
  : parentDir;
const dbPath = databaseUrl.replace(/^file:/, "");
const resolvedUrl = `file:${path.resolve(dbDir, dbPath)}`;

const adapter = new PrismaLibSql({ url: resolvedUrl });

export const db = new PrismaClient({ adapter });
