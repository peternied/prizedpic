/*
  Warnings:

  - You are about to drop the column `active` on the `Contest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Contest" DROP COLUMN "active",
ADD COLUMN     "endsAt" TIMESTAMP(3);
