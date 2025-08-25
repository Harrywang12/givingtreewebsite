# Supabase Storage Setup Guide

This guide will help you set up Supabase Storage for image uploads in your Giving Tree website.

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Wait for the project to be set up (this may take a few minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy your **Project URL** and **anon public** key
3. Add these to your `.env` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 3: Create Storage Bucket

1. In your Supabase dashboard, go to **Storage**
2. Click **Create a new bucket**
3. Name it `images`
4. Set it to **Public** (so images can be accessed without authentication)
5. Click **Create bucket**

## Step 4: Configure Storage Policies

1. In the Storage section, click on your `images` bucket
2. Go to **Policies** tab
3. Click **New Policy**
4. Choose **Create a policy from scratch**
5. Configure the following policies:

### Policy 1: Allow Public Read Access
- **Policy name**: `Public Read Access`
- **Allowed operation**: SELECT
- **Target roles**: `public`
- **Policy definition**: `true`

### Policy 2: Allow Authenticated Uploads
- **Policy name**: `Authenticated Uploads`
- **Allowed operation**: INSERT
- **Target roles**: `authenticated`
- **Policy definition**: `auth.role() = 'authenticated'`

### Policy 3: Allow Users to Update Their Own Files
- **Policy name**: `Update Own Files`
- **Allowed operation**: UPDATE
- **Target roles**: `authenticated`
- **Policy definition**: `auth.role() = 'authenticated'`

### Policy 4: Allow Users to Delete Their Own Files
- **Policy name**: `Delete Own Files`
- **Allowed operation**: DELETE
- **Target roles**: `authenticated`
- **Policy definition**: `auth.role() = 'authenticated'`

## Step 5: Test the Setup

1. Start your development server: `npm run dev`
2. Go to your admin panel and try uploading an image
3. Check that the image appears correctly on your events/announcements pages

## Step 6: Deploy to Vercel

1. Add your Supabase environment variables to Vercel:
   - Go to your Vercel project settings
   - Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. Deploy your application

## Troubleshooting

### Images not uploading
- Check that your Supabase credentials are correct
- Verify that the `images` bucket exists and is public
- Check the browser console for any error messages

### Images not displaying
- Verify that the storage policies allow public read access
- Check that the image URLs are being generated correctly
- Ensure the `EventImage` component is handling the Supabase URLs properly

### Permission errors
- Make sure you're logged in when uploading images
- Check that the storage policies are configured correctly
- Verify that your user has the correct role in the database

## Benefits of Using Supabase Storage

1. **Scalable**: Handles large files and high traffic
2. **Fast**: Global CDN for quick image loading
3. **Secure**: Built-in authentication and authorization
4. **Cost-effective**: Generous free tier
5. **Easy to use**: Simple API for upload/download
6. **Automatic optimization**: Built-in image transformations

## File Structure

Images will be stored in the following structure:
- `events/` - Event and announcement images
- `profiles/` - User profile pictures

Each file will have a unique timestamp and random string to prevent conflicts.
