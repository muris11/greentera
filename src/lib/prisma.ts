import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

// Check if we have a database URL - prefer DIRECT_URL for Vercel/serverless
const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

// Prisma client singleton
const prismaClientSingleton = () => {
  if (!databaseUrl) {
    console.warn(
      "⚠️ DATABASE_URL not configured. Database operations will fail."
    );
    // Return a non-adapter client that will fail gracefully
    return new PrismaClient();
  }

  // Create pg Pool for adapter with connection limits for serverless
  const pool = new Pool({
    connectionString: databaseUrl,
    max: 1, // Limit to 1 connection for serverless functions
    idleTimeoutMillis: 30000, // Close idle connections after 30s
    connectionTimeoutMillis: 5000, // Timeout slow connections after 5s
  });

  // Create Prisma adapter
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
};

// Global type declaration
declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

export default prisma;
