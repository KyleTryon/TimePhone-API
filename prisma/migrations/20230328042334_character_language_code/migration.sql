/*
  Warnings:

  - Added the required column `languageCode` to the `Character` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "languageCode" TEXT NOT NULL;
