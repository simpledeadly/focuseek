/*
  Warnings:

  - You are about to drop the column `parentItemId` on the `items` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_parentItemId_fkey";

-- AlterTable
ALTER TABLE "items" DROP COLUMN "parentItemId",
ADD COLUMN     "parent_item_id" INTEGER;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_parent_item_id_fkey" FOREIGN KEY ("parent_item_id") REFERENCES "items"("id") ON DELETE SET NULL ON UPDATE CASCADE;
