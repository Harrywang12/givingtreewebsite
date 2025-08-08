# 🗄️ Database Setup for Production

## The Problem
Your application is currently trying to connect to `localhost:5432` (local PostgreSQL), but in production on Vercel, there's no local database. You need a cloud database.

## Quick Fix Options

### Option 1: Supabase (Recommended - Free)
1. **Go to**: https://supabase.com
2. **Sign up** for a free account
3. **Create a new project**
4. **Get your connection string**:
   - Go to **Project Settings** (gear icon in sidebar)
   - Click **Database** in the left menu
   - Scroll down to **Connection string** section
   - Copy the **URI** connection string
   - It looks like: `postgresql://postgres:[password]@[host]:5432/postgres`

### Option 2: PlanetScale (Free)
1. **Go to**: https://planetscale.com
2. **Sign up** for a free account
3. **Create a new database**
4. **Get your connection string** from the dashboard

### Option 3: Neon (Free)
1. **Go to**: https://neon.tech
2. **Sign up** for a free account
3. **Create a new project**
4. **Get your connection string** from the dashboard

## Configure Vercel

1. **Go to your Vercel dashboard**: https://vercel.com/harrywang12s-projects/v0-the-giving-tree-website
2. **Click**: Settings → Environment Variables
3. **Add this variable**:
   ```
   Name: DATABASE_URL
   Value: [your_database_connection_string]
   Environment: Production
   ```
4. **Click**: Save

## Run Database Migrations

After setting up the database, you need to create the tables:

```bash
# Set your DATABASE_URL locally
export DATABASE_URL="your_database_connection_string"

# Push the schema to your database
npx prisma db push

# Generate the Prisma client
npx prisma generate
```

## Test Your Setup

1. **Redeploy** your application:
   ```bash
   vercel --prod
   ```

2. **Test the health endpoint**:
   ```
   https://your-app.vercel.app/api/health
   ```

## Expected Result
- ✅ Database connection: "connected"
- ✅ Redis: "not_configured" (until you set up Redis)
- ✅ Status: "healthy"

## Need Help?
If you need assistance setting up any of these databases, let me know which option you prefer and I can provide more detailed steps!
