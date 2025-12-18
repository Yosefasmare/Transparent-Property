import { getProperties } from "@/lib/supabaseClient"; // Fetch dynamic properties
import { NextResponse } from "next/server";

// Simple in-memory cache
let cachedSitemap = "";
let lastBuild = 0;
const CACHE_TIME = 24 * 60 * 60 * 1000; // 24 hours

export const runtime = "edge";

function generateSiteMap(properties: { id: string }[]) {
  const baseUrl = "https://transparentproperty.com";

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}/</loc>
    <priority>1.0</priority>
  </url>

  <!-- Static Pages -->
  <url>
    <loc>${baseUrl}/about</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/locations</loc>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/properties</loc>
    <priority>0.9</priority>
  </url>

  <!-- Dynamic Property Pages -->
  ${properties
    .filter((p) => !p.id.startsWith("admin")) // Exclude admin pages
    .map(
      (property) => `
  <url>
    <loc>${baseUrl}/properties/${property.id}</loc>
    <priority>0.7</priority>
  </url>`
    )
    .join("")}
</urlset>`;
}

export async function GET() {
  // Return cached sitemap if valid
  if (cachedSitemap && Date.now() - lastBuild < CACHE_TIME) {
    return new NextResponse(cachedSitemap, {
      headers: { "Content-Type": "text/xml" },
    });
  }

  // Fetch properties dynamically
  const properties = await getProperties();

  // Generate sitemap
  const sitemap = generateSiteMap(properties);

  // Update cache
  cachedSitemap = sitemap;
  lastBuild = Date.now();

  return new NextResponse(sitemap, {
    headers: { "Content-Type": "text/xml" },
  });
}
