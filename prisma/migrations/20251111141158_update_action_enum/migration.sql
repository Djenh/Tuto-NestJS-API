/*
  Warnings:

  - You are about to drop the `_actiontopermission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `action` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Role` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `_actiontopermission` DROP FOREIGN KEY `_ActionToPermission_A_fkey`;

-- DropForeignKey
ALTER TABLE `_actiontopermission` DROP FOREIGN KEY `_ActionToPermission_B_fkey`;

-- AlterTable
ALTER TABLE `permission` ADD COLUMN `actions` JSON NOT NULL;

-- DropTable
DROP TABLE `_actiontopermission`;

-- DropTable
DROP TABLE `action`;

-- CreateIndex
CREATE UNIQUE INDEX `Role_name_key` ON `Role`(`name`);
