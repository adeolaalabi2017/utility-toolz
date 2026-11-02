import type { MetadataRoute } from "next";
import { DOMAINS, PROFESSIONS, TOOLS } from "@/lib/registry";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://utilitytoolz.com";

  // Root landing page
  const rootRoute: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...["privacy", "terms"].map((path) => ({
      url: `${baseUrl}/${path}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.2,
    })),
  ];

  // Every live domain
  const domainRoutes: MetadataRoute.Sitemap = DOMAINS.map((d) => ({
    url: `${baseUrl}/${d.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Profession hubs
  const professionRoutes: MetadataRoute.Sitemap = PROFESSIONS.map((p) => ({
    url: `${baseUrl}/professions/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Every tool page
  const toolRoutes: MetadataRoute.Sitemap = TOOLS.map((t) => ({
    url: `${baseUrl}/${t.domain}/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  return [...rootRoute, ...domainRoutes, ...professionRoutes, ...toolRoutes];
}
