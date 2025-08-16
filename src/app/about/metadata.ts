import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com';

export const metadata: Metadata = {
  title: 'About Us | The Giving Tree Non-Profit Foundation',
  description: 'Learn about The Giving Tree Foundation, our mission to support Mackenzie Health, our founding story, and our process for turning donations into healthcare improvements.',
  keywords: 'about us, non-profit, healthcare support, Mackenzie Health, foundation history, community donations, giving tree mission',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Us | The Giving Tree Non-Profit Foundation',
    description: 'Learn about The Giving Tree Foundation, our mission to support Mackenzie Health, our founding story, and our process for turning donations into healthcare improvements.',
    url: `${baseUrl}/about`,
    images: [
      {
        url: '/naturelandscape.jpg',
        width: 1200,
        height: 630,
        alt: 'About The Giving Tree Foundation',
      },
    ],
  },
};
