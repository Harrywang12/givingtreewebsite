# Forgot Password Setup Guide

## 🚨 Database Migration Required

The forgot password functionality has been implemented, but you need to update your database to include the new password reset fields.

## 📋 Step-by-Step Instructions

### Step 1: Database Migration
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar
4. Copy and paste the contents of `database-migration-password-reset.sql`
5. Click **"Run"** to execute the migration

### Step 2: Environment Variables
Make sure you have these environment variables set in your Vercel deployment:

```env
GMAIL_USER="your-admin-email@gmail.com"
GMAIL_APP_PASSWORD="your-gmail-app-password"
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
```

### Step 3: Test the Functionality

#### Test Forgot Password Flow:
1. Go to your website and click "Sign In"
2. Click "Forgot your password?" link
3. Enter your email address
4. Click "Send Reset Link"
5. Check your email for the password reset link
6. Click the link to go to the reset password page
7. Enter a new password and confirm it
8. Click "Reset Password"
9. You should be redirected to the dashboard

## 🔧 Features Implemented

### ✅ API Endpoints
- **POST /api/auth/forgot-password** - Sends password reset email
- **POST /api/auth/reset-password** - Resets password with token

### ✅ UI Components
- **Forgot Password Modal** - Integrated into existing AuthModal
- **Reset Password Page** - Standalone page at `/reset-password`
- **Email Templates** - Professional HTML email with reset link

### ✅ Security Features
- **Secure Token Generation** - 32-byte random hex tokens
- **Token Expiration** - 1-hour expiration for security
- **Password Validation** - Minimum 8 characters required
- **Account Unlocking** - Resets failed login attempts and unlocks account
- **Security by Obscurity** - Doesn't reveal if email exists

### ✅ Database Schema
- **resetToken** - Secure token for password reset
- **resetTokenExpiry** - Expiration timestamp
- **Indexed Lookups** - Fast token validation

## 🛡️ Security Considerations

### Token Security
- Tokens are cryptographically secure (32 bytes random)
- Tokens expire after 1 hour
- Tokens are cleared after use
- No token reuse allowed

### Email Security
- Professional HTML email template
- Clear expiration warning
- Instructions for ignoring if not requested
- Secure reset URL with token

### Account Protection
- Resets failed login attempts
- Unlocks account if previously locked
- Validates password strength
- Clears all reset tokens after use

## 🧪 Testing Checklist

- [ ] Forgot password modal opens correctly
- [ ] Email validation works
- [ ] Reset email is sent successfully
- [ ] Email contains correct reset link
- [ ] Reset page loads with token
- [ ] Password validation works (min 8 chars)
- [ ] Password confirmation matching works
- [ ] Reset completes successfully
- [ ] User is redirected to dashboard
- [ ] Old tokens are invalidated
- [ ] Account is unlocked after reset

## 🚨 Troubleshooting

### Email Not Sending
- Check Gmail app password is correct
- Verify GMAIL_USER environment variable
- Check email spam folder
- Review Vercel function logs

### Token Invalid
- Ensure database migration was run
- Check token expiration (1 hour)
- Verify token format in URL
- Check database connection

### Reset Page Not Loading
- Verify NEXT_PUBLIC_APP_URL is set
- Check token parameter in URL
- Review browser console for errors
- Ensure page is deployed correctly

## 📧 Email Template Features

The password reset email includes:
- Professional branding with Giving Tree colors
- Clear call-to-action button
- Fallback text link
- Security warnings and instructions
- Responsive design for mobile devices
- Clear expiration information

## 🔄 Integration with Existing Features

The forgot password functionality integrates seamlessly with:
- **Existing Login System** - No interference with current login
- **Account Lockout System** - Resets failed attempts and unlocks account
- **Email System** - Uses same Gmail configuration
- **UI Design** - Matches existing modal and page styles
- **Security Features** - Follows same security patterns

## ✅ Deployment Ready

The forgot password feature is now ready for deployment. After running the database migration and ensuring environment variables are set, users will be able to:

1. Request password reset from login modal
2. Receive secure reset email
3. Reset password on dedicated page
4. Return to dashboard with new password

All existing functionality remains unchanged and secure.
