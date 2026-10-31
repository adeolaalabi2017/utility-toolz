/** Number & money formatting helpers shared by all tools. */

function toDigits(digits: unknown, fallback = 0): number {
  if (typeof digits === "number" && !isNaN(digits)) {
    return Math.max(0, Math.min(20, Math.floor(digits)));
  }
  return fallback;
}

export function fmtUSD(n: number, digits: unknown = 0): string {
  if (!isFinite(n)) return "—";
  const d = toDigits(digits, 0);
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
}

export function fmtMoney(n: number, symbol = "$", digits: unknown = 0): string {
  if (!isFinite(n)) return "—";
  const d = toDigits(digits, 0);
  const sign = n < 0 ? "-" : "";
  return (
    sign +
    symbol +
    Math.abs(n).toLocaleString("en-US", {
      minimumFractionDigits: d,
      maximumFractionDigits: d,
    })
  );
}

export function fmtNum(n: number, digits: unknown = 0): string {
  if (!isFinite(n)) return "—";
  const d = toDigits(digits, 0);
  return n.toLocaleString("en-US", {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
}

/** Percent from a rate already expressed in percent units (e.g. 4.32 -> "4.32%"). */
export function fmtPct(n: number, digits: unknown = 2): string {
  if (!isFinite(n)) return "—";
  const d = toDigits(digits, 2);
  return (
    n.toLocaleString("en-US", {
      minimumFractionDigits: d,
      maximumFractionDigits: d,
    }) + "%"
  );
}

/** Multiple such as 3.4x */
export function fmtX(n: number, digits: unknown = 2): string {
  if (!isFinite(n)) return "—";
  const d = toDigits(digits, 2);
  return (
    n.toLocaleString("en-US", {
      minimumFractionDigits: d,
      maximumFractionDigits: d,
    }) + "x"
  );
}

/** Months -> "4 yrs 3 mo" / "7 mo" */
export function fmtDuration(months: number): string {
  if (!isFinite(months) || months <= 0) return "—";
  if (months >= 600) return "10+ yrs";
  const m = Math.round(months);
  const yrs = Math.floor(m / 12);
  const rem = m % 12;
  if (yrs === 0) return `${rem} mo`;
  const yrStr = yrs === 1 ? "1 yr" : `${yrs} yrs`;
  if (rem === 0) return yrStr;
  return `${yrStr} ${rem} mo`;
}

/** Compact big numbers: 1.2K, 3.4M */
export function fmtCompact(n: number): string {
  if (!isFinite(n)) return "—";
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return fmtNum(n);
}

/** Safe numeric input read */
export function num(v: string | number, fallback = 0): number {
  if (typeof v === "number") return isFinite(v) ? v : fallback;
  const parsed = parseFloat(String(v).replace(/,/g, ""));
  return isFinite(parsed) ? parsed : fallback;
}

/** Clamp helper */
export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}
