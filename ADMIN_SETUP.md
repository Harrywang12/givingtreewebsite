# Admin System Setup Guide

## 🚨 Database Migration Required

Your website has been deployed with the new admin system, but the database needs to be updated to include the new admin fields.

## 📋 Step-by-Step Instructions

### Step 1: Access Supabase Dashboard
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar

### Step 2: Run the Migration
1. Open the `database-migration.sql` file from your project
2. Copy all the SQL content
3. Paste it into the Supabase SQL Editor
4. Click **"Run"** to execute the migration

### Step 3: Verify the Migration
After running the migration, you should see:
- ✅ New columns added to users table (role, isActive, etc.)
- ✅ New columns added to events table (content, authorId, imageUrl)
- ✅ UserRole enum created
- ✅ System admin user created
- ✅ Foreign key constraints added

### Step 4: Register Admin Accounts
1. Visit your website: https://v0-the-giving-tree-website-80h0i4fqp-harrywang12s-projects.vercel.app
2. Register using **wangharrison2009@gmail.com** (will get SUPER_ADMIN role)
3. Register using **givingtreenonprofit@gmail.com** (will get ADMIN role)

### Step 5: Test Admin Panel
1. Login with either admin email
2. Go to Dashboard
3. Look for the blue **"Admin"** button in the header
4. Click it to open the Admin Panel
5. Try creating a test event

## 🔧 Alternative: Manual Database Update

If you prefer to update manually in Supabase:

1. **Add Columns to app_users:**
   ```sql
   ALTER TABLE app_users ADD COLUMN role TEXT DEFAULT 'USER';
   ALTER TABLE app_users ADD COLUMN "isActive" BOOLEAN DEFAULT true;
   ALTER TABLE app_users ADD COLUMN "lastLogin" TIMESTAMP;
   ALTER TABLE app_users ADD COLUMN "loginAttempts" INTEGER DEFAULT 0;
   ALTER TABLE app_users ADD COLUMN "lockedUntil" TIMESTAMP;
   ```

2. **Add Columns to app_events:**
   ```sql
   ALTER TABLE app_events ADD COLUMN content TEXT;
   ALTER TABLE app_events ADD COLUMN "authorId" TEXT;
   ALTER TABLE app_events ADD COLUMN "imageUrl" TEXT;
   ```

3. **Grant Admin Roles:**
   ```sql
   UPDATE app_users SET role = 'SUPER_ADMIN' WHERE email = 'wangharrison2009@gmail.com';
   UPDATE app_users SET role = 'ADMIN' WHERE email = 'givingtreenonprofit@gmail.com';
   ```

## 🚨 Troubleshooting

### Error: "Column does not exist"
- This means the migration hasn't been run yet
- Follow Step 2 above to run the migration

### Error: "User not found" for admin
- The admin user needs to register first
- Register normally, the system will auto-assign admin role

### Admin button not showing
- Make sure you're logged in with an approved email
- Check that the database migration completed successfully
- Try refreshing the page

## 🔒 Security Notes

- Only emails in the hardcoded list can become admins
- Admin roles are automatically assigned on registration
- All admin actions are logged for security
- Rate limiting protects against abuse

## 📞 Need Help?

If you encounter any issues:
1. Check the Supabase logs for database errors
2. Verify the migration completed successfully
3. Make sure environment variables are set in Vercel
4. Try the troubleshooting steps above

Once the migration is complete, your admin system will be fully functional! 🎉
