/*
  Warnings:

  - You are about to drop the column `characterId` on the `Call` table. All the data in the column will be lost.
  - You are about to drop the `Character` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `character` to the `Call` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Call" DROP CONSTRAINT "Call_characterId_fkey";

-- AlterTable
ALTER TABLE "Call" DROP COLUMN "characterId",
ADD COLUMN     "character" TEXT NOT NULL;

-- DropTable
DROP TABLE "Character";
