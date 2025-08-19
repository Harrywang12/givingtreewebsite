-- Add redirectUrl field to Donation model
ALTER TABLE "app_donations" ADD COLUMN IF NOT EXISTS "redirectUrl" TEXT;

-- Add confirmedAt field to Donation model
ALTER TABLE "app_donations" ADD COLUMN IF NOT EXISTS "confirmedAt" TIMESTAMP;
