/*
  Warnings:

  - You are about to drop the `shoporder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `shoporder`;

-- CreateTable
CREATE TABLE `Order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `student_id_seller` VARCHAR(191) NOT NULL,
    `shop_id` INTEGER NOT NULL,
    `product_id` VARCHAR(191) NOT NULL,
    `student_id_buyer` VARCHAR(191) NOT NULL,
    `address_buyer` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `track` VARCHAR(191) NOT NULL,
    `shippingCompany_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GroupShippingCompany` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_shippingCompany_id_fkey` FOREIGN KEY (`shippingCompany_id`) REFERENCES `GroupShippingCompany`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
