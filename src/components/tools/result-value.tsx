import * as React from "react";
import { cn } from "@/lib/utils";

/** Size steps: long results get smaller rather than overflow their panel. */
const SIZES = {
  hero: ["text-[clamp(3rem,7vw,5rem)]", "text-[clamp(2.25rem,5vw,3.75rem)]", "text-[clamp(1.75rem,3.5vw,2.75rem)]"],
  compact: ["text-display-md", "text-3xl", "text-2xl"],
};

function plainText(children: React.ReactNode): string | null {
  const parts = React.Children.toArray(children);
  return parts.every((p) => typeof p === "string" || typeof p === "number") ? parts.join("") : null;
}

/** The highlighted result: the one accent on a tool's screen. */
export function ResultValue({
  children,
  compact,
  live,
  className,
}: {
  children: React.ReactNode;
  /** For results inside a narrow stat card. */
  compact?: boolean;
  /** Announce changes; leave off when a parent is already a live region. */
  live?: boolean;
  className?: string;
}) {
  const text = plainText(children);
  const length = text?.length ?? 0;
  const step = length <= 10 ? 0 : length <= 14 ? 1 : 2;
  // De-emphasise cents and similar on plain numbers: "$1,580" + ".17".
  const decimals = text && length <= 20 && /^[^a-zA-Z]*\d/.test(text) ? /^(.*\d)(\.\d+.*)$/.exec(text) : null;

  return (
    <p
      className={cn(
        "tnum inline-block max-w-full rounded-md bg-highlight px-3 py-1 font-medium leading-[1.08] tracking-[-0.03em] text-on-highlight [overflow-wrap:anywhere]",
        SIZES[compact ? "compact" : "hero"][step],
        className
      )}
      {...(live ? { role: "status", "aria-live": "polite" as const, "aria-atomic": true } : {})}
    >
      {decimals ? (
        <>
          {decimals[1]}
          <span className="text-[0.5em] font-normal">{decimals[2]}</span>
        </>
      ) : (
        children
      )}
    </p>
  );
}
