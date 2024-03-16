/*
  Warnings:

  - A unique constraint covering the columns `[bank_acc_num]` on the table `bank_details` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pan]` on the table `bank_details` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "bank_details_bank_acc_num_key" ON "bank_details"("bank_acc_num");

-- CreateIndex
CREATE UNIQUE INDEX "bank_details_pan_key" ON "bank_details"("pan");
