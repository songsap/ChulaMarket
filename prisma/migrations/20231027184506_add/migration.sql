/*
  Warnings:

  - Added the required column `totalprice` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` ADD COLUMN `totalprice` INTEGER NOT NULL;
