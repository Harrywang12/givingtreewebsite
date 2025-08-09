# Vercel Deployment Checklist

## Environment Variables Required

Set these in your Vercel dashboard (Settings → Environment Variables):

### Database
```
DATABASE_URL="your-production-postgresql-connection-string"
```

### Email Configuration
```
GMAIL_USER="your-gmail-address@gmail.com"
GMAIL_APP_PASSWORD="your-gmail-app-password"
```

### App Configuration
```
NEXT_PUBLIC_APP_URL="https://your-vercel-domain.vercel.app"
```

## Pre-Deployment Steps

### 1. Database Migration
```bash
# Run this locally with production DATABASE_URL
npx prisma migrate deploy
```

### 2. Build Test
```bash
npm run build
```

### 3. Environment Variable Verification
- [ ] DATABASE_URL points to production database
- [ ] GMAIL_USER is set to your Gmail address
- [ ] GMAIL_APP_PASSWORD is set to Gmail app password
- [ ] NEXT_PUBLIC_APP_URL is set to your Vercel domain

## Post-Deployment Verification

### 1. Test Forgot Password Flow
- [ ] Go to `/dashboard`
- [ ] Click "Sign In"
- [ ] Click "Forgot your password?"
- [ ] Enter email and submit
- [ ] Check email for reset link
- [ ] Click reset link and set new password

### 2. Test Email Functionality
- [ ] Contact form sends emails
- [ ] Donation form sends emails
- [ ] Password reset emails are received

### 3. Test Database Operations
- [ ] User registration works
- [ ] User login works
- [ ] Dashboard loads user data
- [ ] Donations are saved

## Troubleshooting

### Common Issues

1. **Email Not Sending**
   - Check GMAIL_APP_PASSWORD is correct
   - Verify Gmail 2FA is enabled
   - Check Gmail app password permissions

2. **Database Connection Errors**
   - Verify DATABASE_URL is correct
   - Check database is accessible from Vercel
   - Ensure migrations are applied

3. **Password Reset Not Working**
   - Check NEXT_PUBLIC_APP_URL is set correctly
   - Verify reset token is being saved to database
   - Check email delivery

### Debug Commands
```bash
# Check environment variables
echo $DATABASE_URL
echo $GMAIL_USER
echo $NEXT_PUBLIC_APP_URL

# Test database connection
npx prisma db pull

# Check migration status
npx prisma migrate status
```

## Security Notes

- GMAIL_APP_PASSWORD should be kept secret
- DATABASE_URL contains sensitive credentials
- NEXT_PUBLIC_APP_URL is public but should be accurate
- All environment variables are encrypted in Vercel
