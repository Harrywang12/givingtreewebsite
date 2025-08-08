# 🚀 Deploying to Vercel

## Prerequisites

1. **GitHub Account**: Your code should be in a GitHub repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Database**: You'll need a PostgreSQL database (recommended: Supabase, PlanetScale, or Neon)
4. **Redis**: For production, you'll need a Redis service (recommended: Upstash Redis)

## Step 1: Prepare Your Database

### Option A: Supabase (Recommended)
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to Settings > Database to get your connection string
4. Run the database migrations:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

### Option B: PlanetScale
1. Go to [planetscale.com](https://planetscale.com) and create a free account
2. Create a new database
3. Get your connection string from the dashboard

### Option C: Neon
1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Get your connection string from the dashboard

## Step 2: Set Up Redis (Production)

### Option A: Upstash Redis (Recommended)
1. Go to [upstash.com](https://upstash.com) and create a free account
2. Create a new Redis database
3. Copy the connection string

### Option B: Redis Cloud
1. Go to [redis.com](https://redis.com) and create a free account
2. Create a new database
3. Copy the connection string

## Step 3: Deploy to Vercel

### Method 1: Vercel Dashboard (Recommended)

1. **Connect GitHub**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Project**:
   - Framework Preset: Next.js
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

3. **Set Environment Variables**:
   ```
   DATABASE_URL=your_postgresql_connection_string
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=your-super-secret-key-here
   REDIS_URL=your_redis_connection_string
   JWT_SECRET=your-jwt-secret-key-here
   ```

4. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete

### Method 2: Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Set Environment Variables**:
   ```bash
   vercel env add DATABASE_URL
   vercel env add NEXTAUTH_URL
   vercel env add NEXTAUTH_SECRET
   vercel env add REDIS_URL
   vercel env add JWT_SECRET
   ```

## Step 4: Post-Deployment Setup

### 1. Run Database Migrations
After deployment, you need to run your database migrations:

```bash
# Using Vercel CLI
vercel env pull .env.local
npx prisma db push
npx prisma generate
```

### 2. Seed Your Database (Optional)
```bash
npm run db:seed
```

### 3. Update NEXTAUTH_URL
Make sure your `NEXTAUTH_URL` environment variable is set to your actual Vercel domain.

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:port/db` |
| `NEXTAUTH_URL` | Your Vercel domain | `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js | `your-super-secret-key-here` |
| `REDIS_URL` | Redis connection string | `redis://user:pass@host:port` |
| `JWT_SECRET` | Secret for JWT tokens | `your-jwt-secret-key-here` |

## Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check that all dependencies are in `package.json`
   - Ensure TypeScript compilation passes locally
   - Check build logs in Vercel dashboard

2. **Database Connection Issues**:
   - Verify `DATABASE_URL` is correct
   - Ensure database is accessible from Vercel's servers
   - Check if database requires SSL

3. **Redis Connection Issues**:
   - Verify `REDIS_URL` is correct
   - Ensure Redis service is accessible from Vercel
   - Check Redis service status

4. **Authentication Issues**:
   - Verify `NEXTAUTH_URL` matches your domain
   - Check that `NEXTAUTH_SECRET` is set
   - Ensure JWT tokens are working

### Performance Optimization:

1. **Enable Edge Functions** (if needed):
   - Add `"runtime": "edge"` to API routes that don't need Node.js

2. **Optimize Images**:
   - Use Next.js Image component
   - Configure image domains in `next.config.js`

3. **Database Optimization**:
   - Use connection pooling
   - Implement proper indexing
   - Consider read replicas for heavy traffic

## Monitoring & Analytics

1. **Vercel Analytics**:
   - Enable in your Vercel dashboard
   - Track performance and user behavior

2. **Error Monitoring**:
   - Set up error tracking (Sentry, LogRocket)
   - Monitor API response times

3. **Database Monitoring**:
   - Use your database provider's monitoring tools
   - Set up alerts for connection issues

## Security Checklist

- [ ] Environment variables are set in Vercel (not in code)
- [ ] Database connection uses SSL
- [ ] JWT secrets are strong and unique
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented
- [ ] Input validation is in place
- [ ] HTTPS is enforced

## Support

If you encounter issues:
1. Check Vercel's documentation
2. Review build logs in Vercel dashboard
3. Check your database and Redis service status
4. Verify all environment variables are set correctly 