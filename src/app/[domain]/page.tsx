import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DOMAINS, domainBySlug } from "@/lib/registry";
import { DomainHub } from "@/components/pages/domain-hub";

export function generateStaticParams() {
  return DOMAINS.map((d) => ({
    domain: d.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string }>;
}): Promise<Metadata> {
  const { domain: slug } = await params;
  const d = domainBySlug(slug);

  if (!d) {
    return {
      title: "Domain Not Found | Utility Toolz",
    };
  }

  return {
    title: `${d.name} Tools & Calculators`,
    description: d.description,
    alternates: {
      canonical: `/${d.slug}`,
    },
    openGraph: {
      title: `${d.name} Tools & Calculators — Utility Toolz`,
      description: d.description,
      type: "website",
      url: `/${d.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${d.name} Tools — Utility Toolz`,
      description: d.description,
    },
  };
}

export default async function DomainPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain: slug } = await params;
  const d = domainBySlug(slug);

  if (!d) {
    notFound();
  }

  return <DomainHub domainSlug={slug} />;
}
