import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com';

export const metadata: Metadata = {
  title: 'Donate | The Giving Tree Non-Profit Foundation',
  description: 'Support Mackenzie Health by donating items or making financial contributions. 100% of proceeds go directly to enhancing patient care and hospital facilities.',
  keywords: 'donate, healthcare donations, charity giving, support Mackenzie Health, item donations, financial contributions, community support',
  alternates: {
    canonical: '/donate',
  },
  openGraph: {
    title: 'Donate | The Giving Tree Non-Profit Foundation',
    description: 'Support Mackenzie Health by donating items or making financial contributions. 100% of proceeds go directly to enhancing patient care and hospital facilities.',
    url: `${baseUrl}/donate`,
    images: [
      {
        url: '/personworking.jpg',
        width: 1200,
        height: 630,
        alt: 'Donate to The Giving Tree Foundation',
      },
    ],
  },
};
