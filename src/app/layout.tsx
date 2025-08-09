import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <AuthProvider>
          <SiteHeader />
          <main className="min-h-[calc(100vh-12rem)]">{children}</main>
          <SiteFooter />
        </AuthProvider>
      </body>
    </html>
  );
}
