-- CreateTable
CREATE TABLE `shopOrder` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `student_id_seller` VARCHAR(191) NOT NULL,
    `shop_id` VARCHAR(191) NOT NULL,
    `product_id` VARCHAR(191) NOT NULL,
    `student_id_buyer` VARCHAR(191) NOT NULL,
    `address_buyer` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
