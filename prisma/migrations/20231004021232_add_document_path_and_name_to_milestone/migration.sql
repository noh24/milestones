/*
  Warnings:

  - You are about to drop the column `document` on the `milestone` table. All the data in the column will be lost.
  - Added the required column `documentName` to the `Milestone` table without a default value. This is not possible if the table is not empty.
  - Added the required column `documentPath` to the `Milestone` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `milestone` DROP COLUMN `document`,
    ADD COLUMN `documentName` VARCHAR(255) NOT NULL,
    ADD COLUMN `documentPath` VARCHAR(255) NOT NULL;
