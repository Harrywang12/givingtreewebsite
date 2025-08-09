# Analytics Setup Guide

## Google Analytics 4 (GA4) Setup

### 1. Create a Google Analytics Account

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click "Start measuring"
3. Follow the setup wizard to create your account and property
4. Choose "Web" as your platform
5. Enter your website details:
   - Website name: "The Giving Tree Foundation"
   - Website URL: Your domain
   - Industry category: "Non-profit"
   - Business size: Choose appropriate size

### 2. Get Your Measurement ID

1. In your GA4 property, go to **Admin** (gear icon)
2. Under **Property**, click **Data Streams**
3. Click on your web stream
4. Copy the **Measurement ID** (format: G-XXXXXXXXXX)

### 3. Configure Environment Variables

Create a `.env.local` file in your project root and add:

```env
# Google Analytics 4 Measurement ID
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Replace `G-XXXXXXXXXX` with your actual Measurement ID.

### 4. Deploy with Analytics

The analytics component is already integrated into your layout. Once you add the environment variable, analytics will automatically start tracking:

- Page views
- User sessions
- Traffic sources
- User behavior
- Conversion events

### 5. Verify Installation

1. Deploy your site with the environment variable
2. Visit your website
3. Check Google Analytics Real-Time reports to see live data
4. Look for the `gtag` function in your browser's developer tools

## Alternative Analytics Options

### Vercel Analytics (if using Vercel)
```bash
npm install @vercel/analytics
```

### Plausible Analytics (Privacy-focused)
```bash
npm install plausible-tracker
```

### Simple Analytics (Privacy-focused)
```bash
npm install simple-analytics-vue
```

## Custom Event Tracking

To track custom events (like donations, form submissions), you can add:

```typescript
// Track a donation event
gtag('event', 'donation', {
  value: 100,
  currency: 'CAD',
  category: 'engagement'
});

// Track form submissions
gtag('event', 'form_submit', {
  form_name: 'contact_form'
});
```

## Privacy Considerations

- Ensure your privacy policy mentions analytics tracking
- Consider implementing cookie consent if serving EU users
- Review Google Analytics data retention settings
- Consider privacy-focused alternatives for sensitive data
