/*
  Warnings:

  - You are about to drop the column `parent_item_id` on the `items` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_parent_item_id_fkey";

-- AlterTable
ALTER TABLE "items" DROP COLUMN "parent_item_id",
ADD COLUMN     "parentItemId" INTEGER;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_parentItemId_fkey" FOREIGN KEY ("parentItemId") REFERENCES "items"("id") ON DELETE SET NULL ON UPDATE CASCADE;
