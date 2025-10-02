// src/lib/prisma.ts

import { PrismaClient } from '@prisma/client';

// Adicione o cliente Prisma ao objeto global em desenvolvimento
// para evitar que ele seja instanciado várias vezes
declare global {
    var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export { prisma };