import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com';

export const metadata: Metadata = {
  title: 'News & Announcements | The Giving Tree Non-Profit Foundation',
  description: 'Stay updated with the latest news and announcements from The Giving Tree Foundation. Get involved in our mission to support Mackenzie Health.',
  keywords: 'news, announcements, updates, non-profit news, healthcare initiatives, charity news, Mackenzie Health updates',
  alternates: {
    canonical: '/announcements',
  },
  openGraph: {
    title: 'News & Announcements | The Giving Tree Non-Profit Foundation',
    description: 'Stay updated with the latest news and announcements from The Giving Tree Foundation. Get involved in our mission to support Mackenzie Health.',
    url: `${baseUrl}/announcements`,
    images: [
      {
        url: '/homepagehero.jpg',
        width: 1200,
        height: 630,
        alt: 'The Giving Tree Foundation Announcements',
      },
    ],
  },
};
