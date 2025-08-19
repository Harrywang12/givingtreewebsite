-- Add confirmedAt field to Donation model
ALTER TABLE "app_donations" ADD COLUMN "confirmedAt" TIMESTAMP;
