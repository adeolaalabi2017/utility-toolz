import Link from "next/link";
import type { Metadata } from "next";
import { DOMAINS, popularTools } from "@/lib/registry";
import { NotFoundSearch } from "@/components/site/not-found-search";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  const popular = popularTools().slice(0, 6);
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-24">
      <h1 className="font-display text-display-lg tracking-tight">We couldn&apos;t find that page</h1>
      <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
        The link may be old or mistyped (error 404). Search for the tool you need, or pick a domain below.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <NotFoundSearch />
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-full border border-border px-5 text-sm font-semibold hover:bg-accent"
        >
          Go to the home page
        </Link>
      </div>

      <h2 className="mt-14 font-display text-display-sm tracking-tight">Popular tools</h2>
      <ul className="mt-4 flex flex-wrap justify-center gap-2">
        {popular.map((t) => (
          <li key={t.slug}>
            <Link
              href={`/${t.domain}/${t.slug}`}
              className="inline-flex min-h-10 items-center rounded-full border border-border bg-card px-4 text-sm font-medium hover:border-primary/50"
            >
              {t.name}
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 font-display text-display-sm tracking-tight">All domains</h2>
      <ul className="mt-4 flex flex-wrap justify-center gap-2">
        {DOMAINS.map((d) => (
          <li key={d.slug}>
            <Link
              href={`/${d.slug}`}
              className="inline-flex min-h-10 items-center rounded-full border border-border px-4 text-sm hover:bg-accent"
            >
              {d.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
