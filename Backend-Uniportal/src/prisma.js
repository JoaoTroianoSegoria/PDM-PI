import { PrismaClient } from "@prisma/client";

// O PrismaClient é quem vai "conversar" com o seu banco MySQL
export const prisma = new PrismaClient();

