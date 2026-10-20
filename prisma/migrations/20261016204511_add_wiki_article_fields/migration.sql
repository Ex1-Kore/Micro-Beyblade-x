-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WikiArticle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "excerpt" TEXT NOT NULL DEFAULT '',
    "coverImage" TEXT NOT NULL DEFAULT '',
    "imageAlt" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_WikiArticle" ("category", "content", "createdAt", "id", "slug", "title", "updatedAt") SELECT "category", "content", "createdAt", "id", "slug", "title", "updatedAt" FROM "WikiArticle";
DROP TABLE "WikiArticle";
ALTER TABLE "new_WikiArticle" RENAME TO "WikiArticle";
CREATE UNIQUE INDEX "WikiArticle_slug_key" ON "WikiArticle"("slug");
CREATE INDEX "WikiArticle_status_category_idx" ON "WikiArticle"("status", "category");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
