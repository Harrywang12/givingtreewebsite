# Email Setup Guide

This guide will help you set up Gmail SMTP for your nonprofit to receive emails from the contact form and item donation form.

## 📧 **What This Does**

- **Contact Form**: Sends emails from the contact page directly to `Givingtreenonprofit@gmail.com`
- **Item Donation Form**: Sends detailed donation requests with all item information to `Givingtreenonprofit@gmail.com`
- **Professional Formatting**: Beautiful HTML emails with your branding
- **Rate Limiting**: Prevents spam with built-in rate limiting

## ⚙️ **Gmail Setup Steps**

### 1. Enable App Passwords in Gmail

1. Go to your Google Account settings: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Under "Signing in to Google," click on "App passwords"
4. If you don't see "App passwords," you may need to:
   - Enable 2-Step Verification first
   - Then return to this step
5. Click "Generate" and select "Mail" as the app
6. Copy the 16-character app password (something like: `abcd efgh ijkl mnop`)

### 2. Set Environment Variables

You need to add these environment variables to your deployment:

#### **For Vercel (Production):**
```bash
# Add these in your Vercel dashboard under Settings > Environment Variables
GMAIL_USER=Givingtreenonprofit@gmail.com
GMAIL_APP_PASSWORD=your_16_character_app_password_here
```

#### **For Local Development:**
Add to your `.env.local` file:
```bash
GMAIL_USER=Givingtreenonprofit@gmail.com
GMAIL_APP_PASSWORD=your_16_character_app_password_here
```

### 3. Add to Vercel Dashboard

1. Go to your Vercel project dashboard
2. Click on "Settings" tab
3. Click on "Environment Variables" in the sidebar
4. Add two new variables:
   - **Name**: `GMAIL_USER`, **Value**: `Givingtreenonprofit@gmail.com`
   - **Name**: `GMAIL_APP_PASSWORD`, **Value**: `your_16_character_app_password`
5. Make sure both are set for "Production", "Preview", and "Development"
6. Click "Save"

## 📬 **What Emails You'll Receive**

### **Contact Form Emails:**
- **Subject**: "Contact Form: [User's Subject]"
- **From**: Your Gmail account
- **Reply-To**: User's email address
- **Content**: Formatted with user's name, email, subject, and message

### **Item Donation Emails:**
- **Subject**: "New Item Donation Request from [User's Name]"
- **From**: Your Gmail account  
- **Reply-To**: User's email address
- **Content**: Complete donation details including:
  - Donor contact information
  - Item descriptions and conditions
  - Pickup preferences
  - Photos count
  - Additional notes

## 🔒 **Security Features**

- **Rate Limiting**: 5 contact emails per hour, 3 donation emails per hour per IP
- **Input Validation**: All form data is validated before sending
- **Error Handling**: Graceful error messages for users
- **Spam Protection**: Built-in safeguards against spam submissions

## 🚀 **Testing**

After setting up:

1. **Deploy your changes**: `vercel --prod`
2. **Test Contact Form**: Go to `/contact` and submit a message
3. **Test Donation Form**: Go to `/donate` → "Item Donation" and submit
4. **Check Gmail**: Look for emails in `Givingtreenonprofit@gmail.com`

## 🛠️ **Troubleshooting**

### "Authentication failed" error:
- Double-check your Gmail app password
- Make sure 2-Step Verification is enabled
- Verify environment variables are set correctly

### "Email service not configured" error:
- Ensure both `GMAIL_USER` and `GMAIL_APP_PASSWORD` are set in Vercel
- Redeploy after adding environment variables

### Not receiving emails:
- Check Gmail spam folder
- Verify the Gmail account can receive emails
- Check Vercel function logs for errors

## 📞 **Support**

If you need help setting this up, the system will gracefully handle missing configuration and show appropriate error messages to users while logging issues for debugging.

The email templates are professionally designed with your nonprofit branding and include all necessary information for you to follow up with contacts and donors effectively.
