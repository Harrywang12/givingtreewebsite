import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com';

export const metadata: Metadata = {
  title: 'Contact Us | The Giving Tree Non-Profit Foundation',
  description: 'Get in touch with The Giving Tree Foundation. Have questions or want to get involved? Reach out through our contact form, email, or phone.',
  keywords: 'contact us, non-profit contact, get in touch, ask questions, volunteer inquiry, donation questions, support contact',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Us | The Giving Tree Non-Profit Foundation',
    description: 'Get in touch with The Giving Tree Foundation. Have questions or want to get involved? Reach out through our contact form, email, or phone.',
    url: `${baseUrl}/contact`,
    images: [
      {
        url: '/naturelandscape.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact The Giving Tree Foundation',
      },
    ],
  },
};
