import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com';

export const metadata: Metadata = {
  title: 'Volunteer | The Giving Tree Non-Profit Foundation',
  description: 'Join our team of dedicated volunteers at The Giving Tree Foundation. Help us support Mackenzie Health by contributing your time, skills, and passion for community service.',
  keywords: 'volunteer, community service, non-profit volunteering, healthcare volunteers, charity work, help Mackenzie Health, volunteer opportunities',
  alternates: {
    canonical: '/volunteer',
  },
  openGraph: {
    title: 'Volunteer | The Giving Tree Non-Profit Foundation',
    description: 'Join our team of dedicated volunteers at The Giving Tree Foundation. Help us support Mackenzie Health by contributing your time, skills, and passion for community service.',
    url: `${baseUrl}/volunteer`,
    images: [
      {
        url: '/volunteerhero.jpg',
        width: 1200,
        height: 630,
        alt: 'Volunteer with The Giving Tree Foundation',
      },
    ],
  },
};
