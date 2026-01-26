-- AlterTable
ALTER TABLE "Contest" ADD COLUMN     "submissionsClosedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Photo" ADD COLUMN     "submitterEmail" TEXT,
ADD COLUMN     "submitterId" TEXT;
