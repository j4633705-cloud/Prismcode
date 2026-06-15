import dotenv from "dotenv";
import path from "path";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../generated/prisma/client.ts";

dotenv.config({
  path: path.resolve(import.meta.dirname, "../../../.env"),
});

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

// Resolve relative paths from the packages/database directory
const dbDir = path.resolve(import.meta.dirname, "..");
const dbPath = databaseUrl.replace(/^file:/, "");
const resolvedUrl = `file:${path.resolve(dbDir, dbPath)}`;

const adapter = new PrismaLibSql({ url: resolvedUrl });

export const db = new PrismaClient({ adapter });
