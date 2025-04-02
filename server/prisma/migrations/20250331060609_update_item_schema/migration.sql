-- AlterTable
ALTER TABLE "items" ADD COLUMN     "date" TIMESTAMP(3),
ADD COLUMN     "description" TEXT,
ADD COLUMN     "durationPlanned" INTEGER,
ADD COLUMN     "durationReal" INTEGER,
ADD COLUMN     "priority" INTEGER,
ADD COLUMN     "tags" TEXT[];
