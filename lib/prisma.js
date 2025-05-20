import { PrismaClient } from "@prisma/client";

function prismaClientSingleton() {
  return new PrismaClient({
    log: ['error', 'warn'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });
}

if (!globalThis.prisma) {
  globalThis.prisma = prismaClientSingleton();
}

export const db = globalThis.prisma;

// Handle potential disconnection errors
db.$on('error', (e) => {
  console.error('Prisma Client error:', e);
  process.exit(1); // Force process restart on critical database errors
});

process.on('beforeExit', async () => {
  await db.$disconnect();
});

// globalThis.prisma: This global variable ensures that the Prisma client instance is
// reused across hot reloads during development. Without this, each time your application
// reloads, a new instance of the Prisma client would be created, potentially leading
// to connection issues.
