-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "noteId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- Migrate existing comments to Comment table
INSERT INTO "Comment" ("text", "noteId", "createdAt")
SELECT "comment", "id", "updatedAt"
FROM "Note"
WHERE "comment" IS NOT NULL AND "comment" != '';

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "comment";

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;
