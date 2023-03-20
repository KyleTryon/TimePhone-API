/*
  Warnings:

  - Added the required column `prompt` to the `Call` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Call" ADD COLUMN     "prompt" TEXT NOT NULL;
