import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com';

export const metadata: Metadata = {
  title: 'Events & News | The Giving Tree Non-Profit Foundation',
  description: 'Stay updated with the latest events, news, and announcements from The Giving Tree Foundation. Join our community events and see how we\'re making a difference.',
  keywords: 'events, community events, non-profit news, healthcare initiatives, fundraising events, charity news, Mackenzie Health events',
  alternates: {
    canonical: '/events',
  },
  openGraph: {
    title: 'Events & News | The Giving Tree Non-Profit Foundation',
    description: 'Stay updated with the latest events, news, and announcements from The Giving Tree Foundation. Join our community events and see how we\'re making a difference.',
    url: `${baseUrl}/events`,
    images: [
      {
        url: '/homepagehero.jpg',
        width: 1200,
        height: 630,
        alt: 'The Giving Tree Foundation Events',
      },
    ],
  },
};
