import type { Metadata } from "next";
import { DOMAINS, TOOLS } from "@/lib/registry";
import { HomeEntry } from "./home-entry";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://utilitytoolz.com";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Site-wide entities for search engines. The home page is the only place they appear.
const siteSchema = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Utility Toolz",
    url: siteUrl,
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Utility Toolz",
    url: siteUrl,
    logo: `${siteUrl}/icon-512.png`,
    description: `Free professional calculators and utilities, ${TOOLS.length} tools across ${DOMAINS.length} domains.`,
  },
];

export default function RootPage() {
  return (
    <>
      {siteSchema.map((entity) => (
        <script
          key={entity["@type"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entity) }}
        />
      ))}
      <HomeEntry />
    </>
  );
}
