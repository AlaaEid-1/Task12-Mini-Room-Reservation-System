/*
  Warnings:

  - You are about to alter the column `price_per_night` on the `rooms` table. The data in that column could be lost. The data in that column will be cast from `Decimal(8,2)` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE `rooms` MODIFY `price_per_night` DECIMAL(10, 2) NOT NULL;

-- CreateIndex
CREATE INDEX `bookings_room_date_idx` ON `bookings`(`room_id`, `check_in_date`, `check_out_date`);
