import type { Metadata } from "next";
import { Nunito, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Analytics from "@/components/Analytics";

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
  title: "The Giving Tree Non-Profit Foundation",
  description: "Supporting Mackenzie Health through community donations and reselling gently used items. 100% of proceeds go directly to enhancing patient care.",
  keywords: "non-profit, healthcare, donations, Mackenzie Health, community support, sustainability",
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
      </body>
    </html>
  );
}
