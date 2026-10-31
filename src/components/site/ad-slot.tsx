import * as React from "react";
import { cn } from "@/lib/utils";

export interface AdSlotProps {
  slot: "below-tool" | "beside-faq" | "inline";
  className?: string;
}

/**
 * AdSlot Component — Build Plan §7.1 compliant.
 * Enforces strict placement rules: below the working tool (between result and explanation)
 * and beside the FAQ. Never inside or above the working tool itself.
 */
export function AdSlot({ slot, className }: AdSlotProps) {
  return (
    <aside
      data-ad-slot={slot}
      className={cn(
        "my-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/80 p-4 text-center transition-all",
        slot === "below-tool" && "min-h-[120px] sm:min-h-[140px] w-full",
        slot === "beside-faq" && "min-h-[260px] w-full",
        slot === "inline" && "min-h-[90px] w-full",
        className
      )}
      aria-label="Sponsor Advertisement"
    >
      <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2">
        Advertisement
      </span>
      <div className="flex flex-col items-center justify-center text-xs text-muted-foreground/80">
        <p className="font-medium text-foreground/70">
          Ad Space · Reserved for Google AdSense / Premium Partner
        </p>
        <p className="text-[11px] text-muted-foreground/60 mt-0.5">
          {slot === "below-tool"
            ? "Positioned between calculation result and methodology explanation (§7.1)"
            : "Contextual display slot alongside FAQ guidance (§7.1)"}
        </p>
      </div>
    </aside>
  );
}
