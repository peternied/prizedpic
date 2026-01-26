import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";

const connectionString = process.env.POSTGRES_PRISMA_URL;

if (!connectionString) {
	throw new Error("POSTGRES_PRISMA_URL is not set");
}

const allowInvalidCerts =
	process.env.POSTGRES_SSL_ACCEPT_INVALID_CERTS === "true" ||
	(process.env.POSTGRES_SSL_MODE || "").toLowerCase() === "no-verify";

if (allowInvalidCerts) {
	// Loosen TLS validation only when explicitly requested (e.g., self-signed certs in dev).
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const pool = new Pool({
	connectionString,
	// Allow opting out of TLS verification when the Postgres server uses a self-signed cert.
	ssl: allowInvalidCerts ? { rejectUnauthorized: false } : undefined,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export { prisma };