/*
  Warnings:

  - A unique constraint covering the columns `[type]` on the table `claim_types` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[currency]` on the table `currencies` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[receipt]` on the table `receipts` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "claim_types" ALTER COLUMN "type" DROP NOT NULL;

-- AlterTable
ALTER TABLE "claims" ALTER COLUMN "approved_amt" DROP NOT NULL,
ALTER COLUMN "is_approved" DROP NOT NULL,
ALTER COLUMN "approved_by" DROP NOT NULL,
ALTER COLUMN "declined_by" DROP NOT NULL,
ALTER COLUMN "notes" DROP NOT NULL;

-- AlterTable
ALTER TABLE "currencies" ALTER COLUMN "currency" DROP NOT NULL;

-- AlterTable
ALTER TABLE "receipts" ALTER COLUMN "receipt" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "claim_types_type_key" ON "claim_types"("type");

-- CreateIndex
CREATE UNIQUE INDEX "currencies_currency_key" ON "currencies"("currency");

-- CreateIndex
CREATE UNIQUE INDEX "receipts_receipt_key" ON "receipts"("receipt");
