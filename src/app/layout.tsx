import type { Metadata } from "next";
import { Anton, Barlow_Condensed, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";

const power = Anton({
  variable: "--font-power",
  subsets: ["latin"],
  weight: "400",
});

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const display = Barlow_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  style: ["normal", "italic"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "RevLine — A Hybrid Training Club",
    template: "%s · RevLine",
  },
  description:
    "RevLine is a hybrid sports community. Weekend group sessions — running, football, turf, trekking, swimming — built on consistency, strength, and shared energy.",
  openGraph: {
    type: "website",
    siteName: "RevLine",
    title: "RevLine — A Hybrid Training Club",
    description:
      "Consistency builds power, community builds purpose. Join our weekend sessions: running, football, turf, trekking, swimming and more.",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} ${display.variable} ${power.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
