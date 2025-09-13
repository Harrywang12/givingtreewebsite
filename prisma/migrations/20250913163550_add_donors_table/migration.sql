-- AlterTable
ALTER TABLE "public"."app_donations" ALTER COLUMN "confirmedAt" SET DATA TYPE TIMESTAMP(3);

-- CreateTable
CREATE TABLE "public"."app_donors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "amount" DOUBLE PRECISION,
    "message" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_donors_pkey" PRIMARY KEY ("id")
);
