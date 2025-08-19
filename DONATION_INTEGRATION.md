# Mackenzie Health Donation Integration Guide

This document explains how The Giving Tree website integrates with Mackenzie Health's donation platform while maintaining donation tracking capabilities.

## Overview

The integration follows these key steps:

1. Users select a donation amount on The Giving Tree website
2. The system records the donation intent in our database
3. Users are redirected to Mackenzie Health's donation platform
4. After completing their donation, users return to our site for confirmation
5. Donation data is updated in our system

## Setup Instructions

### 1. Database Configuration

The donation tracking system requires two new fields in the `app_donations` table:

```sql
-- Add these fields to your Supabase database
ALTER TABLE "app_donations" ADD COLUMN IF NOT EXISTS "redirectUrl" TEXT;
ALTER TABLE "app_donations" ADD COLUMN IF NOT EXISTS "confirmedAt" TIMESTAMP;
```

Run this SQL in your Supabase SQL editor or apply the migration file at `supabase/migrations/20250810_add_donation_tracking_fields.sql`.

### 2. Environment Variables

Add the following environment variable to your `.env` file:

```
MACKENZIE_HEALTH_WEBHOOK_SECRET=your-secret-key
```

Replace `your-secret-key` with a secure random string that will be shared with Mackenzie Health.

### 3. Webhook Setup with Mackenzie Health

To enable automatic donation confirmation, contact Mackenzie Health's technical team to set up a webhook integration:

1. Provide them with your webhook endpoint: `https://yourdomain.com/api/webhooks/mackenzie-health`
2. Share your webhook secret key (from environment variables)
3. Request that they send donation confirmation data including:
   - `donation_id`: Your system's donation ID (passed as `external_id` in the redirect)
   - `amount`: Final donation amount
   - `status`: Donation status (completed, failed, pending, cancelled)
   - `receipt_number`: Donation receipt/confirmation number
   - `donation_date`: Date of donation

### 4. Return URL Configuration

When redirecting to Mackenzie Health, include a return URL parameter:

```
https://supportmackenziehealth.ca/ui/thegivingtree/donations/start?return_url=https://yourdomain.com/donate/confirm?amount=50&id=donation123&success=true
```

This allows users to be automatically redirected back to your site after completing their donation.

## Verification Methods

The system offers three ways to verify donations:

1. **Automatic Webhook Verification**: Donations are automatically confirmed when Mackenzie Health sends a webhook notification (most reliable)

2. **Return URL Confirmation**: Users are redirected back to your site with a success parameter, triggering automatic confirmation

3. **Manual Verification Options**:
   - Simple confirmation: Users click "Yes, I Completed My Donation"
   - Receipt verification: Users enter their receipt number for stronger verification

## Troubleshooting

If donations aren't being tracked properly:

1. Check that the database schema has been updated with the new fields
2. Verify that the webhook endpoint is accessible from external sources
3. Ensure the webhook secret key matches between your system and Mackenzie Health
4. Check server logs for any webhook processing errors

## Technical Implementation

The integration consists of:

- `MonetaryDonationForm.tsx`: Initial donation form
- `src/app/donate/redirect/page.tsx`: Transition page before Mackenzie Health
- `src/app/donate/confirm/page.tsx`: Confirmation page after donation
- `src/app/api/donations/monetary/route.ts`: API for creating donation records
- `src/app/api/donations/verify/route.ts`: API for verifying donations with receipts
- `src/app/api/webhooks/mackenzie-health/route.ts`: Webhook endpoint for automatic verification
