import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
