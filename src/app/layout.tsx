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
    <html lang="en">
      <body className={`${nunito.variable} ${playfair.variable} font-sans`}>
        <AuthProvider>
          <SiteHeader />
          <main className="min-h-[calc(100vh-12rem)]">{children}</main>
          <SiteFooter />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
