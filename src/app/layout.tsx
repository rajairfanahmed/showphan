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
  title: "Showphan: Developers Portfolio Platform",
  description:
    "A platform built to highlight your skills and achievements to the world. Sign in with GitHub and share all your projects with one link.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://showphan.vercel.app"),
  openGraph: {
    title: "Showphan: Developers Portfolio Platform",
    description:
      "A platform built to highlight your skills and achievements to the world. Sign in with GitHub and share all your projects with one link.",
    siteName: "Showphan",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Showphan: Developer Portfolio Platform",
    description:
      "A platform built to highlight your skills and achievements to the world.",
  },
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
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
