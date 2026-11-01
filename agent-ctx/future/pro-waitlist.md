# Parked feature: Utility Toolz Pro waitlist

Removed from the site on 1 November 2026, to come back in a future update.
Everything needed to restore it is below.

## What it did
- A "Utility Toolz Pro · coming soon" band at the bottom of the home page: planned
  $5/month plan with no ads, saved presets and CSV export on every calculator.
- An email form that POSTs to `/api/waitlist`. It only showed "You're on the list"
  after the server saved the address.
- The API stores the email as a `NewsletterSubscriber` (Prisma model already in
  `prisma/schema.prisma`) with `source: "pro-waitlist"`, and answers 503 when
  `DATABASE_URL` isn't set, so visitors never get a fake confirmation.

## Restore checklist
1. Recreate `src/app/api/waitlist/route.ts` from the code below and set `DATABASE_URL`.
2. Paste `WaitlistForm` into `src/components/pages/home.tsx` above the `Page` section,
   and the home section at the end of `HomePage` (after the professions section).
   Re-add `Check`, `Crown` to the lucide import and `FormEvent` to the React type import.
3. Footer: add a "Pro plan waitlist" link to `/#premium` under "The platform".
4. Privacy page: add a "The Pro waitlist" section explaining the stored email and
   date, what it's used for, and that people can ask for deletion.
5. DESIGN.md §3.7 rule still applies: confirm only after the save succeeds.

## `src/app/api/waitlist/route.ts`
```ts
import { NextResponse } from "next/server";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Pro waitlist sign-up. Stores the address as a NewsletterSubscriber with
 * source "pro-waitlist". The client only shows a confirmation when this
 * returns 2xx, so a missing or unreachable database surfaces as an error
 * instead of a fake success.
 */
export async function POST(req: Request) {
  let email = "";
  try {
    const body = (await req.json()) as { email?: unknown };
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  } catch {
    return NextResponse.json({ error: "Send a JSON body with an email." }, { status: 400 });
  }

  if (!EMAIL.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "The waitlist isn't open yet. Please check back soon." },
      { status: 503 }
    );
  }

  try {
    const { db } = await import("@/lib/db");
    await db.newsletterSubscriber.upsert({
      where: { email },
      update: { active: true },
      create: { email, source: "pro-waitlist" },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("waitlist signup failed", err);
    return NextResponse.json(
      { error: "We couldn't save your email right now. Please try again later." },
      { status: 503 }
    );
  }
}
```

## `WaitlistForm` (home.tsx)
```tsx
/* ------------------------------------------------------------------ */
/* Pro waitlist — only confirms after the server stores the address     */
/* ------------------------------------------------------------------ */

function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setState("error");
      setMessage("Enter a valid email address.");
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || "We couldn't save your email. Please try again later.");
      setState("done");
      setMessage("You're on the list. We'll email you when Pro opens.");
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "We couldn't save your email. Please try again later.");
    }
  };

  if (state === "done") {
    return (
      <p role="status" className="mt-3 flex items-center gap-2 text-sm font-medium text-[#fef5de]">
        <Check className="h-4 w-4" aria-hidden /> {message}
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="mt-3 space-y-2" noValidate>
      <label htmlFor="waitlist-email" className="text-sm font-medium text-[#fef5de]/90">
        Email for the Pro waitlist
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="waitlist-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "error") setState("idle");
          }}
          aria-invalid={state === "error" || undefined}
          aria-describedby={state === "error" ? "waitlist-msg" : undefined}
          placeholder="you@company.com"
          className="h-11 min-w-0 flex-1 rounded-md border border-[#fef5de]/30 bg-[#fef5de]/10 px-3 text-sm text-[#fef5de] placeholder:text-[#fef5de]/60 focus-visible:outline-[#fef5de]"
        />
        <Button
          type="submit"
          disabled={state === "sending"}
          aria-busy={state === "sending"}
          className="h-11 bg-[#fef5de] px-6 font-semibold text-ink hover:bg-white"
        >
          {state === "sending" ? "Joining…" : "Join the waitlist"}
        </Button>
      </div>
      {state === "error" && (
        <p id="waitlist-msg" role="alert" className="text-sm text-[#ffd2c2]">
          {message}
        </p>
      )}
      <p className="text-xs text-[#fef5de]/75">
        We only use this to tell you when Pro launches.{" "}
        <Link href="/privacy" className="underline underline-offset-2 hover:text-[#fef5de]">
          Privacy policy
        </Link>
      </p>
    </form>
  );
}
```

## Home page section (end of `HomePage`)
```tsx
      {/* 5. Pro waitlist */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6" aria-labelledby="premium">
        <div className="overflow-hidden rounded-2xl border border-[#24443b] bg-ink px-6 py-10 text-[#fef5de] shadow-lark sm:px-12 sm:py-14 dark:border-[#22503d]">
          <div className="grid items-start gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#f0a469]">
                <Crown className="h-4 w-4" aria-hidden /> Utility Toolz Pro · coming soon
              </p>
              <h2 id="premium" className="mt-4 font-display text-3xl font-semibold tracking-tight text-[#fef5de] sm:text-4xl">
                Ad-free, with your presets saved
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-[#fef5de]/90">
                The tools stay free. Pro is planned at $5/month: no ads, saved scenarios across devices, and
                CSV export on every calculator.
              </p>
              <WaitlistForm />
            </div>
            <ul className="space-y-3.5" aria-label="Planned Pro features">
              {[`No ads across all ${liveCount} tools`, "Saved presets and calculation history", "CSV export on every calculator"].map(
                (b) => (
                  <li key={b} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e07a3c]/30 text-[#f0a469]">
                      <Check className="h-3 w-3" aria-hidden />
                    </span>
                    <span className="font-medium text-[#fef5de]/95">{b}</span>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </section>
```
