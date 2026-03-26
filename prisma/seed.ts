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
  const projectCount = await prisma.project.count();
  if (projectCount > 0) {
    console.log("Projects already seeded, skipping.");
    return;
  }

  await prisma.project.createMany({
    data: [
      { name: "Project Alpha" },
      { name: "Project Beta" },
      { name: "Project Gamma" },
      { name: "Project Delta" },
    ],
  });
  console.log("Seeded 4 default projects.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
