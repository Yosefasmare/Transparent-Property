import type { Metadata, Viewport } from "next";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
  title: "Transparent property - Trusted House Renting & Selling Platform",
  description:
    "Find your dream home with Transparent property. A transparent and trusted real estate platform for renting and selling houses. Explore verified properties, connect with reliable agents, and make confident decisions. Your trusted partner in real estate.",
  keywords:
    "Transparent property, Transparent property, house renting, house selling, real estate, property rental, home buying, trusted real estate, verified properties, reliable agents, property marketplace, rent house Ethiopia, buy house Ethiopia",
  authors: [{ name: "Transparent property Team" }],
  creator: "Transparent property",
  publisher: "Transparent property",
  robots: "index, follow",
  metadataBase: new URL("https://transparentproperty.com"),
  openGraph: {
    title: "Transparent property - Trusted House Renting & Selling Platform",
    description:
      "Discover your perfect home with Transparent property. We provide a transparent and trusted platform for renting and selling houses. Browse verified listings and connect with trusted agents.",
    url: "https://transparentproperty.com",
    type: "website",
    locale: "en_US",
    siteName: "Transparent property",
    images: [
      {
        url: "https://transparentproperty.com/logo.webp", 
        width: 1200,
        height: 630,
        alt: "Transparent property - Trusted House Renting & Selling Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Transparent property - Trusted House Renting & Selling Platform",
    description:
      "Discover your perfect home with Transparent property. Browse verified properties, connect with reliable agents, and make confident real estate decisions.",
    images: ["https://transparentproperty.com/logo.webp"], 
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
