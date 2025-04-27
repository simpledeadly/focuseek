-- CreateTable
CREATE TABLE "item_timers" (
    "item_id" INTEGER NOT NULL,
    "start_time" BIGINT,
    "tracked_duration" BIGINT NOT NULL DEFAULT 0,
    "is_running" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "item_timers_pkey" PRIMARY KEY ("item_id")
);

-- AddForeignKey
ALTER TABLE "item_timers" ADD CONSTRAINT "item_timers_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
