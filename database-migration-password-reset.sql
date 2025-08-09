-- Password Reset Migration for The Giving Tree Website
-- Run this in your Supabase SQL Editor

-- Add password reset fields to app_users table
ALTER TABLE "app_users" 
ADD COLUMN "resetToken" TEXT,
ADD COLUMN "resetTokenExpiry" TIMESTAMP(3);

-- Create index for reset token lookups
CREATE INDEX IF NOT EXISTS "idx_app_users_resetToken" ON "app_users"("resetToken");

-- Add comment for documentation
COMMENT ON COLUMN "app_users"."resetToken" IS 'Secure token for password reset functionality';
COMMENT ON COLUMN "app_users"."resetTokenExpiry" IS 'Expiration timestamp for password reset token';
