import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

// Check if we have a database URL
const databaseUrl = process.env.DATABASE_URL;

// Prisma client singleton
const prismaClientSingleton = () => {
  if (!databaseUrl) {
    console.warn('⚠️ DATABASE_URL not configured. Database operations will fail.');
    // Return a non-adapter client that will fail gracefully
    return new PrismaClient();
  }
  
  // Create pg Pool for adapter
  const pool = new Pool({
    connectionString: databaseUrl,
  });
  
  // Create Prisma adapter
  const adapter = new PrismaPg(pool);
  
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
};

// Global type declaration
declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

export default prisma;
