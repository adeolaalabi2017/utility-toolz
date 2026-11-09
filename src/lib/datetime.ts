/**
 * Date, working-day and time-zone helpers shared by the Phase 4 tools.
 * All parsing is calendar-local (no UTC drift): "2026-11-02" is that
 * calendar day in the viewer's own time zone.
 */

/** Parse "YYYY-MM-DD" into a local Date, rejecting impossible dates. */
export function parseISODate(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim());
  if (!m) return null;
  const y = +m[1];
  const mo = +m[2];
  const d = +m[3];
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  const dt = new Date(y, mo - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return null;
  return dt;
}

/** Local Date -> "YYYY-MM-DD" (for date inputs). */
export const toISODate = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const todayISO = (): string => toISODate(new Date());

export function fmtDate(
  d: Date,
  opts: Intl.DateTimeFormatOptions = { weekday: "short", year: "numeric", month: "short", day: "numeric" }
): string {
  return d.toLocaleDateString("en-US", opts);
}

export const daysInMonth = (y: number, mIdx: number): number => new Date(y, mIdx + 1, 0).getDate();

/** Calendar difference: full years, months and days from `from` to `to`. */
export function diffYMD(from: Date, to: Date): { y: number; m: number; d: number } {
  let months = (to.getFullYear() - from.getFullYear()) * 12 + to.getMonth() - from.getMonth();
  if (addMonthsSafe(from, months) > to) months -= 1;
  // Count the days from the last whole month, so Jan 31 -> Mar 1 is 1 month 1 day.
  const anchor = addMonthsSafe(from, months);
  const d = Math.round(
    (Date.UTC(to.getFullYear(), to.getMonth(), to.getDate()) -
      Date.UTC(anchor.getFullYear(), anchor.getMonth(), anchor.getDate())) /
      86_400_000
  );
  return { y: Math.trunc(months / 12), m: months % 12, d };
}

/** Add months, clamping the day (Jan 31 + 1 month -> Feb 28). */
export function addMonthsSafe(start: Date, months: number): Date {
  const y = start.getFullYear();
  const m = start.getMonth() + months;
  return new Date(y, m, Math.min(start.getDate(), daysInMonth(y, m)));
}

/** Weekdays (Mon-Fri) between two dates, inclusive. */
export function countWeekdays(from: Date, to: Date): number {
  let count = 0;
  const cur = new Date(from);
  while (cur <= to) {
    const wd = cur.getDay();
    if (wd !== 0 && wd !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

export function countWeekendDays(from: Date, to: Date): number {
  const total = Math.round((to.getTime() - from.getTime()) / 86_400_000) + 1;
  return total - countWeekdays(from, to);
}

/** Advance n working days past `start` (Mon-Fri; the start day itself is not counted). */
export function addWorkingDays(start: Date, n: number): Date {
  const cur = new Date(start);
  let left = n;
  while (left > 0) {
    cur.setDate(cur.getDate() + 1);
    const wd = cur.getDay();
    if (wd !== 0 && wd !== 6) left--;
  }
  return cur;
}

/* ------------------------------ time zones ------------------------------ */

/** Offset (ms) of `zone` at `instant`: wall-clock-in-zone minus UTC. */
export function tzOffsetMs(instant: Date, zone: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts: Record<string, string> = {};
  for (const p of dtf.formatToParts(instant)) parts[p.type] = p.value;
  const asUtc = Date.UTC(
    +parts.year,
    +parts.month - 1,
    +parts.day,
    +parts.hour,
    +parts.minute,
    +parts.second
  );
  return asUtc - instant.getTime();
}

/**
 * Wall time in `zone` -> UTC epoch ms. Two passes handle DST edges.
 * Returns null when the inputs are not a real date/time.
 */
export function zonedToInstant(dateISO: string, timeHM: string, zone: string): number | null {
  const ts = Date.parse(`${dateISO}T${timeHM}:00Z`);
  if (!isFinite(ts)) return null;
  let instant = ts;
  for (let i = 0; i < 2; i++) instant = ts - tzOffsetMs(new Date(instant), zone);
  return instant;
}

export function fmtOffset(ms: number): string {
  const sign = ms < 0 ? "-" : "+";
  const abs = Math.abs(ms);
  const h = Math.floor(abs / 3_600_000);
  const m = Math.round((abs % 3_600_000) / 60_000);
  return m === 0 ? `UTC${sign}${h}` : `UTC${sign}${h}:${String(m).padStart(2, "0")}`;
}

export const fmtZoneTime = (ms: number, zone: string): string =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    hourCycle: "h23",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ms));

export const fmtZoneDate = (ms: number, zone: string): string =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(ms));

/** Epoch-day index of the calendar date the instant falls on inside `zone`. */
export function zonedDayIndex(ms: number, zone: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const p: Record<string, string> = {};
  for (const part of dtf.formatToParts(new Date(ms))) p[part.type] = part.value;
  return Date.UTC(+p.year, +p.month - 1, +p.day) / 86_400_000;
}

export function tzAbbrev(ms: number, zone: string): string {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: zone, timeZoneName: "short" }).formatToParts(
    new Date(ms)
  );
  return parts.find((p) => p.type === "timeZoneName")?.value ?? zone;
}
