-- Drop the invented "bst" (Burst) stat from Ratchet and Bit.
-- This stat had no factual source (not on the box, not in the Beyblade X Wiki)
-- and was an internal invented value. Removing it to keep data factual.
-- CreateTable
-- (none)

-- AlterTable
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_Ratchet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "height" REAL NOT NULL,
    "sides" INTEGER NOT NULL,
    "weight" REAL NOT NULL,
    "atk" INTEGER NOT NULL,
    "def" INTEGER NOT NULL,
    "sta" INTEGER NOT NULL,
    "desc" TEXT NOT NULL
);

INSERT INTO "new_Ratchet" ("id","name","height","sides","weight","atk","def","sta","desc")
SELECT "id","name","height","sides","weight","atk","def","sta","desc" FROM "Ratchet";

DROP TABLE "Ratchet";
ALTER TABLE "new_Ratchet" RENAME TO "Ratchet";

CREATE TABLE "new_Bit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "weight" REAL NOT NULL,
    "speed" INTEGER NOT NULL,
    "atk" INTEGER NOT NULL,
    "def" INTEGER NOT NULL,
    "sta" INTEGER NOT NULL,
    "burstResist" INTEGER NOT NULL,
    "desc" TEXT NOT NULL
);

INSERT INTO "new_Bit" ("id","name","type","weight","speed","atk","def","sta","burstResist","desc")
SELECT "id","name","type","weight","speed","atk","def","sta","burstResist","desc" FROM "Bit";

DROP TABLE "Bit";
ALTER TABLE "new_Bit" RENAME TO "Bit";

PRAGMA foreign_keys=ON;
