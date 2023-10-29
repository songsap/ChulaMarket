/*
  Warnings:

  - Added the required column `product_name` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_price` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shop_name` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` ADD COLUMN `product_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `product_price` INTEGER NOT NULL,
    ADD COLUMN `shop_name` VARCHAR(191) NOT NULL;
