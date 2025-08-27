import { PrismaClient } from '@prisma/client';

declare global {
  // Allow global.prisma to exist in dev to prevent multiple instances
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['error', 'warn'],
  });

// Assign to global in development to avoid multiple instances
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
