/*
  Warnings:

  - You are about to drop the `item_timers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "item_timers" DROP CONSTRAINT "item_timers_item_id_fkey";

-- DropTable
DROP TABLE "item_timers";

-- CreateTable
CREATE TABLE "timers" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "collection_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "start_time" BIGINT,
    "tracked_duration" BIGINT NOT NULL DEFAULT 0,
    "is_running" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "timers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "timers_item_id_key" ON "timers"("item_id");

-- AddForeignKey
ALTER TABLE "timers" ADD CONSTRAINT "timers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timers" ADD CONSTRAINT "timers_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timers" ADD CONSTRAINT "timers_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
