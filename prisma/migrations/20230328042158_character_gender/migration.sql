/*
  Warnings:

  - Added the required column `gender` to the `Character` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CharacterGender" AS ENUM ('MALE', 'FEMALE', 'NEUTRAL');

-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "gender" "CharacterGender" NOT NULL;
