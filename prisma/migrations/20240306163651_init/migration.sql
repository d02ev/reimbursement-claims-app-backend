-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL,
    "fullname" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "is_approver" BOOLEAN NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL,
    "role" VARCHAR NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_details" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL,
    "password_hash" VARCHAR NOT NULL,
    "refresh_token" VARCHAR NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "password_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_details" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL,
    "bank_name" VARCHAR NOT NULL,
    "ifsc" VARCHAR NOT NULL,
    "bank_acc_num" VARCHAR NOT NULL,
    "pan" VARCHAR NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "bank_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claims" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL,
    "date" DATE NOT NULL,
    "requestPhase" VARCHAR NOT NULL,
    "requested_amt" DECIMAL(7,2) NOT NULL DEFAULT 0.00,
    "approved_amt" DECIMAL(7,2) NOT NULL DEFAULT 0.00,
    "is_approved" BOOLEAN NOT NULL,
    "approved_by" VARCHAR NOT NULL,
    "declined_by" VARCHAR NOT NULL,
    "notes" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "claims_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receipts" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL,
    "receipt" VARCHAR NOT NULL DEFAULT 'Not Attached',
    "claimId" INTEGER NOT NULL,

    CONSTRAINT "receipts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "currencies" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL,
    "currency" VARCHAR NOT NULL,
    "claimId" INTEGER NOT NULL,

    CONSTRAINT "currencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claim_types" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL,
    "type" VARCHAR NOT NULL,
    "claimId" INTEGER NOT NULL,

    CONSTRAINT "claim_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RoleToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "roles_role_key" ON "roles"("role");

-- CreateIndex
CREATE UNIQUE INDEX "password_details_password_hash_key" ON "password_details"("password_hash");

-- CreateIndex
CREATE UNIQUE INDEX "password_details_refresh_token_key" ON "password_details"("refresh_token");

-- CreateIndex
CREATE UNIQUE INDEX "password_details_user_id_key" ON "password_details"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "bank_details_user_id_key" ON "bank_details"("user_id");

-- CreateIndex
CREATE INDEX "bank_details_ifsc_bank_acc_num_pan_idx" ON "bank_details"("ifsc", "bank_acc_num", "pan");

-- CreateIndex
CREATE UNIQUE INDEX "claims_user_id_key" ON "claims"("user_id");

-- CreateIndex
CREATE INDEX "claims_approved_by_declined_by_is_approved_idx" ON "claims"("approved_by", "declined_by", "is_approved");

-- CreateIndex
CREATE UNIQUE INDEX "receipts_claimId_key" ON "receipts"("claimId");

-- CreateIndex
CREATE UNIQUE INDEX "currencies_claimId_key" ON "currencies"("claimId");

-- CreateIndex
CREATE UNIQUE INDEX "claim_types_claimId_key" ON "claim_types"("claimId");

-- CreateIndex
CREATE UNIQUE INDEX "_RoleToUser_AB_unique" ON "_RoleToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_RoleToUser_B_index" ON "_RoleToUser"("B");

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

-- AddForeignKey
ALTER TABLE "_RoleToUser" ADD CONSTRAINT "_RoleToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToUser" ADD CONSTRAINT "_RoleToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
