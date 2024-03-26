-- CreateTable
CREATE TABLE `Member` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `loginId` VARCHAR(200) NOT NULL,
    `password` CHAR(200) NOT NULL,
    `role` ENUM('master', 'admin', 'member') NOT NULL DEFAULT 'member',
    `firstLoginState` BOOLEAN NOT NULL DEFAULT true,
    `createTime` VARCHAR(191) NOT NULL,
    `updateTime` VARCHAR(191) NOT NULL,
    `permission` LONGTEXT NOT NULL,
    `firstName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `emailConfirm` BOOLEAN NOT NULL DEFAULT false,
    `ipList` VARCHAR(191) NOT NULL DEFAULT '[]',
    `avatar` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Member_loginId_key`(`loginId`),
    UNIQUE INDEX `Member_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `memberId` INTEGER NOT NULL,
    `note` LONGTEXT NOT NULL,
    `createTime` VARCHAR(191) NOT NULL,
    `lastLogin` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `banners` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `img` VARCHAR(191) NOT NULL,
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'inactive',
    `createAt` VARCHAR(191) NULL,
    `updateAt` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` CHAR(255) NOT NULL,
    `codeName` CHAR(255) NOT NULL,
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',

    UNIQUE INDEX `categories_title_key`(`title`),
    UNIQUE INDEX `categories_codeName_key`(`codeName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `brands` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` CHAR(255) NOT NULL,
    `codeName` CHAR(255) NOT NULL,
    `createAt` VARCHAR(191) NULL,
    `updateAt` VARCHAR(191) NULL,
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'inactive',

    UNIQUE INDEX `brands_title_key`(`title`),
    UNIQUE INDEX `brands_codeName_key`(`codeName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `avatar` LONGTEXT NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `des` LONGTEXT NOT NULL,
    `price` INTEGER NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `detail` LONGTEXT NULL,
    `brandId` INTEGER NOT NULL,
    `categoryId` INTEGER NOT NULL,

    INDEX `products_categoryId_fkey`(`categoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pictures` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` LONGTEXT NOT NULL,
    `productId` INTEGER NOT NULL,

    INDEX `pictures_productId_fkey`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products_specification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `screen` VARCHAR(191) NULL,
    `os` VARCHAR(191) NULL,
    `camera` VARCHAR(191) NULL,
    `cameraFront` VARCHAR(191) NULL,
    `cpu` VARCHAR(191) NULL,
    `ram` VARCHAR(191) NULL,
    `rom` VARCHAR(191) NULL,
    `microUSB` VARCHAR(191) NULL,
    `battery` VARCHAR(191) NULL,
    `productId` INTEGER NOT NULL,
    `productsId` INTEGER NULL,

    UNIQUE INDEX `products_specification_productId_key`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `promo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NULL,
    `productId` INTEGER NOT NULL,

    UNIQUE INDEX `promo_productId_key`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `avatar` LONGTEXT NOT NULL,
    `firstName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NULL,
    `userName` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `emailConfirm` ENUM('active', 'inactive') NOT NULL DEFAULT 'inactive',
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createAt` VARCHAR(191) NOT NULL,
    `updateAt` VARCHAR(191) NULL,
    `lastLogin` VARCHAR(191) NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `bio` VARCHAR(191) NULL,
    `birthday` VARCHAR(191) NULL,
    `wallet` DOUBLE NOT NULL DEFAULT 0,
    `ipList` VARCHAR(191) NOT NULL DEFAULT '[]',

    UNIQUE INDEX `User_userName_key`(`userName`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_ip_list` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ip` CHAR(255) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `userId` INTEGER NOT NULL,
    `createAt` VARCHAR(191) NOT NULL,
    `deviceName` VARCHAR(191) NOT NULL,

    INDEX `user_ip_list_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `address` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` CHAR(255) NOT NULL,
    `postcode` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `address_title_key`(`title`),
    INDEX `address_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `receipts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `total` INTEGER NOT NULL DEFAULT 0,
    `createAt` VARCHAR(191) NOT NULL,
    `updateAt` VARCHAR(191) NOT NULL,
    `paid` BOOLEAN NOT NULL DEFAULT false,
    `paidAt` VARCHAR(191) NULL,
    `payMode` ENUM('cash', 'transfer') NULL DEFAULT 'cash',
    `userId` INTEGER NOT NULL,
    `status` ENUM('shopping', 'accepted', 'denied', 'pending', 'shipping', 'done', 'deleted') NOT NULL DEFAULT 'shopping',
    `pending` VARCHAR(191) NULL,
    `acceptAt` VARCHAR(191) NULL,
    `cancelAt` VARCHAR(191) NULL,
    `shippingAt` VARCHAR(191) NULL,
    `doneAt` VARCHAR(191) NULL,
    `deleteAt` VARCHAR(191) NULL,
    `usersId` INTEGER NULL,

    INDEX `receipts_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `receipt_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `receiptId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `note` VARCHAR(191) NOT NULL DEFAULT '',

    INDEX `receipt_details_productId_fkey`(`productId`),
    INDEX `receipt_details_receiptId_fkey`(`receiptId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Chat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `memberId` INTEGER NULL,
    `content` VARCHAR(191) NOT NULL,
    `type` ENUM('TEXT', 'IMG', 'VIDEO', 'LINK') NOT NULL DEFAULT 'TEXT',
    `createAt` VARCHAR(191) NOT NULL,
    `discordChannel` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `logs` ADD CONSTRAINT `logs_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `Member`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `brands`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pictures` ADD CONSTRAINT `pictures_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products_specification` ADD CONSTRAINT `products_specification_productsId_fkey` FOREIGN KEY (`productsId`) REFERENCES `products`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `promo` ADD CONSTRAINT `promo_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_ip_list` ADD CONSTRAINT `user_ip_list_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `address` ADD CONSTRAINT `address_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `receipts` ADD CONSTRAINT `receipts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `receipt_details` ADD CONSTRAINT `receipt_details_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `receipt_details` ADD CONSTRAINT `receipt_details_receiptId_fkey` FOREIGN KEY (`receiptId`) REFERENCES `receipts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chat` ADD CONSTRAINT `Chat_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chat` ADD CONSTRAINT `Chat_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `Member`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
