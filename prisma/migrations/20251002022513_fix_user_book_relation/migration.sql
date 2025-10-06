-- AlterTable
ALTER TABLE `book` ADD COLUMN `userId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `CurrentReading` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bookId` INTEGER NOT NULL,
    `currentPage` INTEGER NOT NULL DEFAULT 0,
    `isPaused` BOOLEAN NOT NULL DEFAULT false,
    `startedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `predictedFinish` DATETIME(3) NULL,

    UNIQUE INDEX `CurrentReading_bookId_key`(`bookId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProgressUpdate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `readingId` INTEGER NOT NULL,
    `pagesRead` INTEGER NOT NULL,
    `readingTimeMin` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReadingNote` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `readingId` INTEGER NOT NULL,
    `pageReference` INTEGER NULL,
    `content` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `resetToken` VARCHAR(191) NULL,
    `resetTokenExpiry` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_resetToken_key`(`resetToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `book_userId_idx` ON `book`(`userId`);

-- AddForeignKey
ALTER TABLE `book` ADD CONSTRAINT `book_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CurrentReading` ADD CONSTRAINT `CurrentReading_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `book`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProgressUpdate` ADD CONSTRAINT `ProgressUpdate_readingId_fkey` FOREIGN KEY (`readingId`) REFERENCES `CurrentReading`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReadingNote` ADD CONSTRAINT `ReadingNote_readingId_fkey` FOREIGN KEY (`readingId`) REFERENCES `CurrentReading`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
