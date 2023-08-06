-- DropForeignKey
ALTER TABLE `milestone` DROP FOREIGN KEY `Milestone_userId_fkey`;

-- DropForeignKey
ALTER TABLE `profile` DROP FOREIGN KEY `Profile_userId_fkey`;

-- AlterTable
ALTER TABLE `milestone` ADD COLUMN `type` VARCHAR(255) NULL;

-- AddForeignKey
ALTER TABLE `Milestone` ADD CONSTRAINT `Milestone_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
