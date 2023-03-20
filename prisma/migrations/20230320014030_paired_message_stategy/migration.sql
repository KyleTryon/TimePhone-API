/*
  Warnings:

  - You are about to drop the column `audioUrl` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `body` on the `Message` table. All the data in the column will be lost.
  - Added the required column `messageAudioUrl` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `messageText` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `responseAudioUrl` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `responseText` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "audioUrl",
DROP COLUMN "body",
ADD COLUMN     "messageAudioUrl" TEXT NOT NULL,
ADD COLUMN     "messageText" TEXT NOT NULL,
ADD COLUMN     "responseAudioUrl" TEXT NOT NULL,
ADD COLUMN     "responseText" TEXT NOT NULL;
