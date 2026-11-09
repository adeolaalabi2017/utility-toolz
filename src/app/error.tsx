"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error }: { error: unknown }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-24">
      <h1 className="font-display text-display-lg tracking-tight">This page stopped working</h1>
      <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
        Something in the values or file you entered may have caused it. Starting over clears them from the link.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          // A retry would re-read the same bad values from the URL, so drop them.
          onClick={() => window.location.replace(window.location.pathname)}
          className="inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Start this page over
        </button>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-full border border-border px-5 text-sm font-semibold hover:bg-accent"
        >
          Go to the home page
        </Link>
      </div>
    </section>
  );
}
