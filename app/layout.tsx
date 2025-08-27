import type { Metadata, Viewport } from "next";
import "./globals.css";
import Head from "next/head";
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
  title: "Hullu House - Trusted House Renting & Selling Platform",
  description:
    "Find your dream home with Hullu House. A transparent and trusted real estate platform for renting and selling houses. Explore verified properties, connect with reliable agents, and make confident decisions. Your trusted partner in real estate.",
  keywords:
    "Hullu House, Hulu House, house renting, house selling, real estate, property rental, home buying, trusted real estate, verified properties, reliable agents, property marketplace, rent house Ethiopia, buy house Ethiopia",
  authors: [{ name: "Hullu House Team" }],
  creator: "Hullu House",
  publisher: "Hullu House",
  robots: "index, follow",
  metadataBase: new URL("https://hulluhouse.com"),
  openGraph: {
    title: "Hullu House - Trusted House Renting & Selling Platform",
    description:
      "Discover your perfect home with Hullu House. We provide a transparent and trusted platform for renting and selling houses. Browse verified listings and connect with trusted agents.",
    url: "https://hulluhouse.com",
    type: "website",
    locale: "en_US",
    siteName: "Hullu House",
    images: [
      {
        url: "https://hulluhouse.com/logo.webp", 
        width: 1200,
        height: 630,
        alt: "Hullu House - Trusted House Renting & Selling Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hullu House - Trusted House Renting & Selling Platform",
    description:
      "Discover your perfect home with Hullu House. Browse verified properties, connect with reliable agents, and make confident real estate decisions.",
    images: ["https://hulluhouse.com/logo.webp"], 
  },
};


export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1B365D", // Deep Navy
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
         <link rel="preconnect" href="https://udlwtcamuqfxdxhrniau.supabase.co" crossOrigin="" />
      </Head>
      <body className="antialiased bg-background text-neutral-700">
        <NextTopLoader
          color="#000080"     // Customize color
          height={6}       // Thickness in px
          crawlSpeed={200} // Speed
          showSpinner={false} // Hide spinner
        />
        {children}
      </body>
    </html>
  );
}
