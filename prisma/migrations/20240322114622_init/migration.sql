-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL,
    "fullname" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL,
    "role" VARCHAR NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_details" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL,
    "password_hash" VARCHAR NOT NULL,
    "refresh_token" VARCHAR NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "password_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_details" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL,
    "bank_name" VARCHAR NOT NULL,
    "ifsc" VARCHAR NOT NULL,
    "bank_acc_num" VARCHAR NOT NULL,
    "pan" VARCHAR NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "bank_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claims" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL,
    "date" DATE NOT NULL,
    "request_phase" VARCHAR DEFAULT 'In Process',
    "requested_amt" DECIMAL(7,2) NOT NULL DEFAULT 0.00,
    "approved_amt" DECIMAL(7,2) DEFAULT 0.00,
    "is_approved" BOOLEAN DEFAULT false,
    "is_declined" BOOLEAN DEFAULT false,
    "approved_by" VARCHAR,
    "declined_by" VARCHAR,
    "notes" TEXT,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "claims_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receipts" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL,
    "receipt" VARCHAR DEFAULT 'Not Attached',
    "claimId" TEXT NOT NULL,

    CONSTRAINT "receipts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "currencies" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL,
    "currency" VARCHAR DEFAULT 'INR',
    "claimId" TEXT NOT NULL,

    CONSTRAINT "currencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claim_types" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL,
    "type" VARCHAR DEFAULT 'Others',
    "claimId" TEXT NOT NULL,

    CONSTRAINT "claim_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "roles_role_key" ON "roles"("role");

-- CreateIndex
CREATE UNIQUE INDEX "roles_user_id_key" ON "roles"("user_id");

-- CreateIndex
CREATE INDEX "roles_role_idx" ON "roles"("role");

-- CreateIndex
CREATE UNIQUE INDEX "password_details_password_hash_key" ON "password_details"("password_hash");

-- CreateIndex
CREATE UNIQUE INDEX "password_details_refresh_token_key" ON "password_details"("refresh_token");

-- CreateIndex
CREATE UNIQUE INDEX "password_details_user_id_key" ON "password_details"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "bank_details_bank_acc_num_key" ON "bank_details"("bank_acc_num");

-- CreateIndex
CREATE UNIQUE INDEX "bank_details_pan_key" ON "bank_details"("pan");

-- CreateIndex
CREATE UNIQUE INDEX "bank_details_user_id_key" ON "bank_details"("user_id");

-- CreateIndex
CREATE INDEX "bank_details_ifsc_bank_acc_num_pan_idx" ON "bank_details"("ifsc", "bank_acc_num", "pan");

-- CreateIndex
CREATE UNIQUE INDEX "claims_user_id_key" ON "claims"("user_id");

-- CreateIndex
CREATE INDEX "claims_approved_by_declined_by_is_approved_is_declined_idx" ON "claims"("approved_by", "declined_by", "is_approved", "is_declined");

-- CreateIndex
CREATE UNIQUE INDEX "receipts_receipt_key" ON "receipts"("receipt");

-- CreateIndex
CREATE UNIQUE INDEX "receipts_claimId_key" ON "receipts"("claimId");

-- CreateIndex
CREATE INDEX "receipts_receipt_idx" ON "receipts"("receipt");

-- CreateIndex
CREATE UNIQUE INDEX "currencies_currency_key" ON "currencies"("currency");

-- CreateIndex
CREATE UNIQUE INDEX "currencies_claimId_key" ON "currencies"("claimId");

-- CreateIndex
CREATE INDEX "currencies_currency_idx" ON "currencies"("currency");

-- CreateIndex
CREATE UNIQUE INDEX "claim_types_type_key" ON "claim_types"("type");

-- CreateIndex
CREATE UNIQUE INDEX "claim_types_claimId_key" ON "claim_types"("claimId");

-- CreateIndex
CREATE INDEX "claim_types_type_idx" ON "claim_types"("type");

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_details" ADD CONSTRAINT "password_details_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_details" ADD CONSTRAINT "bank_details_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "claims"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "currencies" ADD CONSTRAINT "currencies_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "claims"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_types" ADD CONSTRAINT "claim_types_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "claims"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
