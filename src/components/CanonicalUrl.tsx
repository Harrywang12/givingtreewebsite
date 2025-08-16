'use client';

import Head from 'next/head';
import { usePathname } from 'next/navigation';

interface CanonicalUrlProps {
  path?: string;
}

export default function CanonicalUrl({ path }: CanonicalUrlProps) {
  const pathname = usePathname();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com';
  const canonicalPath = path || pathname || '';
  const canonicalUrl = `${baseUrl}${canonicalPath}`;

  return (
    <Head>
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  );
}
