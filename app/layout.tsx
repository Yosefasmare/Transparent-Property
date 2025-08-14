import type { Metadata, Viewport } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Hulu House - Trusted House Renting & Selling Platform",
  description: "Discover your perfect home with Hulu House. We're a transparent and trusted platform for renting and selling houses. Browse verified properties, connect with reliable agents, and make informed decisions with confidence. Your trusted partner in real estate.",
  keywords: "house renting, house selling, real estate platform, property rental, home buying, trusted real estate, transparent property platform, verified properties, reliable agents, house marketplace",
  authors: [{ name: "Hulu House Team" }],
  creator: "Hulu House",
  publisher: "Hulu House",
  robots: "index, follow",
  openGraph: {
    title: "Hulu House - Trusted House Renting & Selling Platform",
    description: "Discover your perfect home with Hulu House. We're a transparent and trusted platform for renting and selling houses. Browse verified properties, connect with reliable agents, and make informed decisions with confidence.",
    type: "website",
    locale: "en_US",
    siteName: "Hulu House",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hulu House - Trusted House Renting & Selling Platform",
    description: "Discover your perfect home with Hulu House. We're a transparent and trusted platform for renting and selling houses.",
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4F46E5", // Indigo color matching your design
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
