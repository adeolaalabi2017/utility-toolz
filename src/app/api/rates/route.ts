import { NextResponse } from "next/server";

export const revalidate = 43200; // 12-hour ISR revalidation

// Baseline snapshot rates as resilient fallback
const SNAPSHOT_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
  CNY: 7.21,
  INR: 83.4,
  CAD: 1.37,
  AUD: 1.53,
  CHF: 0.88,
  SGD: 1.34,
  AED: 3.67,
  ZAR: 18.1,
  BRL: 5.42,
  MXN: 17.6,
  NGN: 1540,
  KRW: 1352,
  TRY: 34.2,
  PLN: 3.98,
  SEK: 10.45,
  NZD: 1.66,
  HKD: 7.79,
};

export async function GET() {
  try {
    // 3-second timeout for reliable edge performance
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      signal: controller.signal,
      next: { revalidate: 43200 },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.rates && typeof data.rates === "object") {
        return NextResponse.json(
          {
            base: "USD",
            rates: data.rates,
            updatedAt: data.time_last_update_utc || new Date().toISOString(),
            source: "live",
          },
          {
            headers: {
              "Cache-Control": "public, s-maxage=43200, stale-while-revalidate=86400",
            },
          }
        );
      }
    }
  } catch {
    // Graceful fallback to static rates on network timeout or external API errors
  }

  return NextResponse.json(
    {
      base: "USD",
      rates: SNAPSHOT_RATES,
      updatedAt: new Date().toISOString(),
      source: "snapshot",
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    }
  );
}
