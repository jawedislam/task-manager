import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const url = process.env.DATABASE_URL ?? "";

let adapter: unknown;
if (url.startsWith("file:") || url.endsWith(".db")) {
  const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
  adapter = new PrismaBetterSqlite3({ url });
} else {
  const { PrismaPg } = require("@prisma/adapter-pg");
  const { Pool } = require("pg");
  const pool = new Pool({ connectionString: url });
  adapter = new PrismaPg(pool);
}

const prisma = new PrismaClient({ adapter } as any);

async function main() {
  const count = await prisma.manager.count();
  if (count > 0) {
    console.log("Managers already seeded, skipping.");
    return;
  }

  await prisma.manager.createMany({
    data: [
      { name: "Alice Johnson", email: "alice@example.com" },
      { name: "Bob Smith", email: "bob@example.com" },
      { name: "Carol Davis", email: "carol@example.com" },
    ],
  });
  console.log("Seeded 3 default managers.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
