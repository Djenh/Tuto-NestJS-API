-- AlterTable
ALTER TABLE `picture` MODIFY `path` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `service` MODIFY `name` VARCHAR(255) NOT NULL,
    MODIFY `description` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `email` VARCHAR(255) NOT NULL;
