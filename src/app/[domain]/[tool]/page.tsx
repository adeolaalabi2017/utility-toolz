import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TOOLS, toolBySlug } from "@/lib/registry";
import { ToolPage } from "@/components/pages/tool-page";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://utilitytoolz.com";

export function generateStaticParams() {
  return TOOLS.map((t) => ({
    domain: t.domain,
    tool: t.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string; tool: string }>;
}): Promise<Metadata> {
  const { domain, tool: slug } = await params;
  const t = toolBySlug(slug);

  if (!t || t.domain !== domain) {
    return {
      title: "Tool Not Found | Utility Toolz",
    };
  }

  const title = `${t.name} — Free Online Tool`;
  const description = t.description || t.tagline;
  const canonicalUrl = `/${t.domain}/${t.slug}`;

  return {
    title,
    description,
    keywords: t.tags,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${t.name} — Utility Toolz`,
      description,
      type: "website",
      url: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: `${t.name} — Utility Toolz`,
      description: t.tagline,
    },
  };
}

export default async function ToolRoutePage({
  params,
}: {
  params: Promise<{ domain: string; tool: string }>;
}) {
  const { domain, tool: slug } = await params;
  const t = toolBySlug(slug);

  if (!t || t.domain !== domain) {
    notFound();
  }

  // Schema.org Structured Data: WebApplication
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t.name,
    url: `${siteUrl}/${t.domain}/${t.slug}`,
    description: t.description || t.tagline,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript. Runs client-side in web browser.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  // Schema.org Structured Data: FAQPage
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ToolPage toolSlug={slug} />
    </>
  );
}
