/*
  Warnings:

  - You are about to drop the column `price` on the `app_inventory_items` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."app_donors" ADD COLUMN     "itemDonated" TEXT;

-- AlterTable
ALTER TABLE "public"."app_inventory_items" DROP COLUMN "price";
