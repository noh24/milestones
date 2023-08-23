/*
  Warnings:

  - Added the required column `date` to the `Milestone` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `milestone` ADD COLUMN `date` DATE NOT NULL;
