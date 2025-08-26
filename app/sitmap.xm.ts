import { getProperties } from "@/lib/supabaseClient"; // Fetch your dynamic properties
import { NextResponse } from "next/server";

export const runtime = "edge"; // optional, for faster responses

export async function GET() {
  const properties = await getProperties(); // Dynamic property list
  const baseUrl = "https://hulluhouse.com";

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
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
    .map(
      (property) => `
  <url>
    <loc>${baseUrl}/properties/${property.id}</loc>
    <priority>0.7</priority>
  </url>
  `
    )
    .join("")}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: { "Content-Type": "text/xml" },
  });
}
