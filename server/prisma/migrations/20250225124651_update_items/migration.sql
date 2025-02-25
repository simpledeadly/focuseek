-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('todo', 'note', 'project');

-- CreateTable
CREATE TABLE "items" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "type" "ItemType" NOT NULL,
    "isDone" BOOLEAN,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subitems" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "type" "ItemType" NOT NULL,
    "isDone" BOOLEAN,
    "parentId" INTEGER,

    CONSTRAINT "subitems_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "subitems" ADD CONSTRAINT "subitems_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "items"("id") ON DELETE SET NULL ON UPDATE CASCADE;
