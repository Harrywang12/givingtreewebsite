'use client';

import Script from 'next/script';

interface EventJsonLdProps {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  imageUrl?: string;
  organizerName?: string;
}

export default function EventJsonLd({
  id,
  title,
  description,
  startDate,
  endDate,
  location,
  imageUrl,
  organizerName = 'The Giving Tree Non-Profit Foundation',
}: EventJsonLdProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com';
  
  const eventData = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    'name': title,
    'description': description,
    'startDate': startDate,
    'endDate': endDate || startDate,
    'eventStatus': 'https://schema.org/EventScheduled',
    'eventAttendanceMode': 'https://schema.org/OfflineEventAttendanceMode',
    'location': location ? {
      '@type': 'Place',
      'name': location,
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': location
      }
    } : {
      '@type': 'VirtualLocation',
      'url': `${baseUrl}/events/${id}`
    },
    'image': imageUrl ? [imageUrl] : [`${baseUrl}/homepagehero.jpg`],
    'organizer': {
      '@type': 'Organization',
      'name': organizerName,
      'url': baseUrl
    },
    'offers': {
      '@type': 'Offer',
      'availability': 'https://schema.org/InStock',
      'price': '0',
      'priceCurrency': 'CAD',
      'validFrom': new Date().toISOString().split('T')[0]
    },
    'performer': {
      '@type': 'Organization',
      'name': organizerName
    },
    'url': `${baseUrl}/events/${id}`
  };

  return (
    <Script
      id={`event-jsonld-${id}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(eventData) }}
    />
  );
}
