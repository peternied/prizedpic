/*
  Warnings:

  - You are about to drop the column `battles` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the column `losses` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the column `wins` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the column `loserId` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the column `winnerId` on the `Vote` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[voterId,photoId,voteType,contestId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `photoId` to the `Vote` table without a default value. This is not possible if the table is not empty.
  - Made the column `contestId` on table `Vote` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_contestId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_loserId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_winnerId_fkey";

-- DropIndex
DROP INDEX "Vote_voterId_winnerId_loserId_voteType_contestId_key";

-- AlterTable
ALTER TABLE "Photo" DROP COLUMN "battles",
DROP COLUMN "losses",
DROP COLUMN "rating",
DROP COLUMN "wins";

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "loserId",
DROP COLUMN "winnerId",
ADD COLUMN     "photoId" TEXT NOT NULL,
ALTER COLUMN "contestId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Vote_voterId_photoId_voteType_contestId_key" ON "Vote"("voterId", "photoId", "voteType", "contestId");

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "Photo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
