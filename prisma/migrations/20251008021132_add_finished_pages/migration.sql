/*
  Warnings:

  - Made the column `pages` on table `book` required. This step will fail if there are existing NULL values in that column.
  - Made the column `finishedPages` on table `book` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `book` MODIFY `pages` INTEGER NOT NULL,
    MODIFY `finishedPages` INTEGER NOT NULL DEFAULT 0;
