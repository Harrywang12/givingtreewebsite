import type { Metadata } from "next";
import { Nunito, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Analytics from "@/components/Analytics";
import Script from "next/script";

const nunito = Nunito({ 
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"]
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com'),
  title: "The Giving Tree Non-Profit Foundation | Supporting Mackenzie Health",
  description: "The Giving Tree Foundation transforms generosity into healthcare support, collecting and reselling items with 100% of proceeds going to Mackenzie Health to enhance patient care.",
  keywords: "non-profit, healthcare donations, Mackenzie Health, community support, sustainability, charity, giving back, hospital support, medical funding, volunteer opportunities",
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com',
    siteName: 'The Giving Tree Non-Profit Foundation',
    title: 'The Giving Tree Non-Profit Foundation | Supporting Mackenzie Health',
    description: 'Supporting Mackenzie Health through community donations and reselling gently used items. 100% of proceeds go directly to enhancing patient care.',
    images: [
      {
        url: '/homepagehero.jpg',
        width: 1200,
        height: 630,
        alt: 'The Giving Tree Non-Profit Foundation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Giving Tree Non-Profit Foundation | Supporting Mackenzie Health',
    description: 'Supporting Mackenzie Health through community donations and reselling gently used items.',
    images: ['/homepagehero.jpg'],
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
    shortcut: '/logo.png',
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-[var(--color-bg)] text-[var(--color-fg)]">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Suppress Chrome extension errors
              window.addEventListener('error', function(e) {
                if (e.message.includes('_gchrome_uniqueid') || e.message.includes('chrome-extension')) {
                  e.preventDefault();
                  return false;
                }
              });
              
              // Suppress console errors from extensions
              const originalError = console.error;
              console.error = function(...args) {
                const message = args.join(' ');
                if (message.includes('_gchrome_uniqueid') || message.includes('chrome-extension')) {
                  return;
                }
                originalError.apply(console, args);
              };
            `,
          }}
        />
      </head>
      <body className={`${nunito.variable} ${playfair.variable} font-sans text-[var(--color-fg)] bg-[var(--color-bg)] antialiased selection:bg-green-200/40 selection:text-green-900`}>
        <AuthProvider>
          <SiteHeader />
          <main className="min-h-[calc(100vh-12rem)] pb-20 sm:pb-0">{children}</main>
          <SiteFooter />
        </AuthProvider>
        <Analytics />
        
        {/* Organization Schema */}
        <Script id="organization-schema" type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NonProfit",
            "name": "The Giving Tree Non-Profit Foundation",
            "url": process.env.NEXT_PUBLIC_APP_URL || "https://yourdomain.com",
            "logo": `${process.env.NEXT_PUBLIC_APP_URL || "https://yourdomain.com"}/logo.png`,
            "sameAs": [],
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "(905) 883-1212",
              "contactType": "customer service",
              "email": "Givingtreenonprofit@gmail.com"
            },
            "description": "The Giving Tree Foundation transforms generosity into tangible support for healthcare. We collect and resell gently used items, directing 100% of proceeds to Mackenzie Health, fostering a community of giving that improves care for all.",
            "foundingDate": "2025-09",
            "founder": {
              "@type": "Person",
              "name": "Ruogu Qiu and Justin Wu"
            },
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Richmond Hill",
              "addressRegion": "ON",
              "addressCountry": "CA"
            }
          })
        }} />
      </body>
    </html>
  );
}
