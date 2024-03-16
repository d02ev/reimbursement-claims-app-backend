/*
  Warnings:

  - You are about to drop the column `requestPhase` on the `claims` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "claim_types" ALTER COLUMN "type" SET DEFAULT 'Misc';

-- AlterTable
ALTER TABLE "claims" DROP COLUMN "requestPhase",
ADD COLUMN     "request_phase" VARCHAR DEFAULT 'In Process',
ALTER COLUMN "is_approved" SET DEFAULT false;

-- AlterTable
ALTER TABLE "currencies" ALTER COLUMN "currency" SET DEFAULT 'INR';
