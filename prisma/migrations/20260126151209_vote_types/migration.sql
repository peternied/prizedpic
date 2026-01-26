/*
  Warnings:

  - A unique constraint covering the columns `[voterId,winnerId,loserId,voteType,contestId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('OVERALL', 'TECHNICAL', 'FUNNY');

-- DropIndex
DROP INDEX "Vote_voterId_winnerId_loserId_key";

-- AlterTable
ALTER TABLE "Photo" ADD COLUMN     "contestId" TEXT;

-- AlterTable
ALTER TABLE "Vote" ADD COLUMN     "contestId" TEXT,
ADD COLUMN     "voteType" "VoteType" NOT NULL DEFAULT 'OVERALL';

-- CreateTable
CREATE TABLE "Contest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Contest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Vote_voteType_idx" ON "Vote"("voteType");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_voterId_winnerId_loserId_voteType_contestId_key" ON "Vote"("voterId", "winnerId", "loserId", "voteType", "contestId");

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
