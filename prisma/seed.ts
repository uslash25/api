import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

async function main() {
  dotenv.config({
    path: '.env', override: true,
  });

  const prisma = new PrismaClient;

  await prisma.$connect();

  await prisma.$disconnect();
}

main().catch(e => {
  if (e instanceof Error) {
    console.error(e.name);

    console.error(e.message);
  }
});
