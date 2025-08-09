-- Admin System Migration for The Giving Tree Website
-- Run this in your Supabase SQL Editor

-- Step 1: Create UserRole enum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');

-- Step 2: Add new columns to app_users table
ALTER TABLE "app_users" 
ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'USER',
ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "lastLogin" TIMESTAMP(3),
ADD COLUMN "loginAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "lockedUntil" TIMESTAMP(3);

-- Step 3: Add new columns to app_events table
ALTER TABLE "app_events" 
ADD COLUMN "content" TEXT,
ADD COLUMN "authorId" TEXT NOT NULL DEFAULT 'system',
ADD COLUMN "imageUrl" TEXT;

-- Step 4: Create a system admin user for existing events
INSERT INTO "app_users" (
    "id", 
    "email", 
    "name", 
    "password", 
    "role", 
    "isActive", 
    "createdAt", 
    "updatedAt"
) VALUES (
    'system-admin-user',
    'admin@givingtree.org',
    'System Administrator',
    '$2a$12$dummy.hash.for.system.user.only.used.for.existing.events',
    'ADMIN',
    true,
    NOW(),
    NOW()
) ON CONFLICT ("email") DO NOTHING;

-- Step 5: Update existing events to have the system admin as author
UPDATE "app_events" 
SET "authorId" = 'system-admin-user' 
WHERE "authorId" = 'system';

-- Step 6: Add foreign key constraint for event authors
ALTER TABLE "app_events" 
ADD CONSTRAINT "app_events_authorId_fkey" 
FOREIGN KEY ("authorId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Step 7: Grant admin roles to approved emails (if they exist)
UPDATE "app_users" 
SET "role" = 'SUPER_ADMIN', "isActive" = true 
WHERE "email" = 'wangharrison2009@gmail.com';

UPDATE "app_users" 
SET "role" = 'ADMIN', "isActive" = true 
WHERE "email" = 'givingtreenonprofit@gmail.com';

-- Step 8: Create indexes for performance
CREATE INDEX IF NOT EXISTS "idx_app_users_role" ON "app_users"("role");
CREATE INDEX IF NOT EXISTS "idx_app_users_isActive" ON "app_users"("isActive");
CREATE INDEX IF NOT EXISTS "idx_app_users_email_active" ON "app_users"("email", "isActive");
CREATE INDEX IF NOT EXISTS "idx_app_events_authorId" ON "app_events"("authorId");
CREATE INDEX IF NOT EXISTS "idx_app_events_isActive" ON "app_events"("isActive");

-- Verification queries (optional - run these to check the migration)
-- SELECT COUNT(*) as total_users, 
--        COUNT(CASE WHEN role = 'ADMIN' OR role = 'SUPER_ADMIN' THEN 1 END) as admin_users
-- FROM "app_users";

-- SELECT "email", "role", "isActive" 
-- FROM "app_users" 
-- WHERE "role" IN ('ADMIN', 'SUPER_ADMIN');

-- SELECT COUNT(*) as events_with_authors 
-- FROM "app_events" 
-- WHERE "authorId" IS NOT NULL;
