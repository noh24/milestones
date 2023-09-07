/*
  Warnings:

  - Made the column `document` on table `milestone` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `milestone` MODIFY `document` VARCHAR(255) NOT NULL;
