/*
  Warnings:

  - You are about to drop the column `messageAudioUrl` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `messageText` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `responseAudioUrl` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `responseText` on the `Message` table. All the data in the column will be lost.
  - Added the required column `text` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ChatGPTMessageRole" AS ENUM ('assistant', 'system', 'user');

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "messageAudioUrl",
DROP COLUMN "messageText",
DROP COLUMN "responseAudioUrl",
DROP COLUMN "responseText",
ADD COLUMN     "audioUrl" TEXT,
ADD COLUMN     "role" "ChatGPTMessageRole" NOT NULL DEFAULT 'user',
ADD COLUMN     "text" TEXT NOT NULL;
