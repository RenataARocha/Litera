-- AlterTable
ALTER TABLE `book` ADD COLUMN `finishedPages` INTEGER NULL DEFAULT 0,
    MODIFY `pages` INTEGER NULL;
