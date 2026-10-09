import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Showphan — Single-Link Developer Portfolio & Proof-of-Work Platform",
    template: "%s | Showphan",
  },
  description:
    "Turn your repositories into verified proof-of-work. Showphan gives every developer a high-fidelity showcase link with 16:9 visual proof and a 5-rule quality gate.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://showphan.vercel.app"),
  authors: [{ name: "Raja Irfan Ahmed", url: "https://rajairfanahmed.vercel.app" }],
  creator: "Raja Irfan Ahmed",
  publisher: "Raja Irfan Ahmed",
  keywords: [
    "developer portfolio",
    "software engineer showcase",
    "proof of work",
    "github portfolio",
    "single link portfolio",
    "showphan",
    "Raja Irfan Ahmed",
  ],
  openGraph: {
    title: "Showphan — Single-Link Developer Portfolio & Proof-of-Work Platform",
    description:
      "Turn your repositories into verified proof-of-work. High-fidelity developer showcases with 16:9 visual proof.",
    siteName: "Showphan",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Showphan — Developer Portfolio Platform",
    description:
      "Turn your repositories into verified proof-of-work. Created by Raja Irfan Ahmed.",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://showphan.vercel.app/#website",
      "name": "Showphan",
      "alternateName": ["Show Phan", "showfan"],
      "url": "https://showphan.vercel.app",
      "description": "The Single-Link Showcase for Developers to Turn Repositories into Proof-of-Work.",
      "inLanguage": "en-US",
      "publisher": {
        "@type": "Person",
        "name": "Raja Irfan Ahmed",
        "url": "https://rajairfanahmed.vercel.app",
      },
    },
    {
      "@type": "WebApplication",
      "@id": "https://showphan.vercel.app/#webapp",
      "name": "Showphan",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "All",
      "url": "https://showphan.vercel.app",
      "author": {
        "@type": "Person",
        "name": "Raja Irfan Ahmed",
        "url": "https://rajairfanahmed.vercel.app",
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
