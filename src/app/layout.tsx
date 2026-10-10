import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";

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
    default: "Showphan — Where developers discover and showcase what's next",
    template: "%s | Showphan",
  },
  description:
    "Free, open-source developer showcase platform. Discover trending software projects, live interactive sandboxes, verified engineering proofs, and high-impact developer portfolios.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://showphan.vercel.app"),
  authors: [{ name: "Raja Irfan Ahmed", url: "https://rajairfanahmed.vercel.app" }],
  creator: "Raja Irfan Ahmed",
  publisher: "Raja Irfan Ahmed",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/icon.svg",
  },
  keywords: [
    "developer portfolio",
    "developer showcase",
    "daily dev alternative",
    "open source projects",
    "live sandbox",
    "software engineer portfolio",
    "proof of work",
    "github showcase",
    "showphan",
    "Raja Irfan Ahmed",
  ],
  openGraph: {
    title: "Showphan — Where developers discover and showcase what's next",
    description:
      "Free, open-source developer showcase platform. Discover trending software projects, live interactive sandboxes, and verified developer portfolios.",
    siteName: "Showphan",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Showphan — Where developers discover and showcase what's next",
    description:
      "Discover trending software projects, live sandboxes, and verified developer portfolios. Crafted by Raja Irfan Ahmed.",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://showphan.vercel.app/#website",
      "name": "Showphan",
      "alternateName": ["Showphan Dev", "Show Phan"],
      "url": "https://showphan.vercel.app",
      "description":
        "Free, open-source developer showcase platform. Discover trending software projects, live interactive sandboxes, verified engineering proofs, and high-impact developer portfolios.",
      "inLanguage": "en-US",
      "publisher": {
        "@type": "Person",
        "name": "Raja Irfan Ahmed",
        "url": "https://rajairfanahmed.vercel.app",
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://showphan.vercel.app/explore?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "SiteNavigationElement",
      "name": "Explore",
      "description": "Discover high-velocity developer tools, trending open-source projects, and new releases.",
      "url": "https://showphan.vercel.app/explore",
    },
    {
      "@type": "SiteNavigationElement",
      "name": "Live Sandboxes",
      "description": "Test interactive in-browser live applications across desktop, tablet, and mobile viewports.",
      "url": "https://showphan.vercel.app/explore",
    },
    {
      "@type": "SiteNavigationElement",
      "name": "Inspiration Vault",
      "description": "Bookmark, curate, and organize outstanding projects from the developer community.",
      "url": "https://showphan.vercel.app/dashboard/bookmarks",
    },
    {
      "@type": "SiteNavigationElement",
      "name": "Command Studio",
      "description": "Import repositories from GitHub, evaluate real-time Quality Gate HUDs, and publish.",
      "url": "https://showphan.vercel.app/dashboard/new",
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
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("showphan-theme")||"dark";document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <SmoothScrollProvider>
          <Header />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
