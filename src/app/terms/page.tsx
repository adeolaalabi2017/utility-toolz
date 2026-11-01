import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "The terms for using Utility Toolz calculators and utilities.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of use" updated="1 November 2026">
      <p>By using Utility Toolz you agree to these terms.</p>

      <h2>Use of the tools</h2>
      <ul>
        <li>The tools are free to use for personal and commercial work.</li>
        <li>Don&apos;t try to disrupt the service, scrape it at a volume that harms other visitors, or resell it as your own.</li>
      </ul>

      <h2>Results are estimates, not advice</h2>
      <p>
        Calculators use standard formulas and the numbers you enter. Results are for information only and are
        not financial, tax, legal, medical or other professional advice. Check important figures with a
        qualified professional before relying on them.
      </p>

      <h2>No warranty</h2>
      <p>
        The site is provided &ldquo;as is&rdquo;. We work to keep formulas correct, but we can&apos;t guarantee
        that every result is accurate, complete or suitable for your situation, and we are not liable for
        decisions made using it, to the extent the law allows.
      </p>

      <h2>Changes</h2>
      <p>We may update the tools and these terms. The date at the top shows the latest version.</p>
    </LegalPage>
  );
}
