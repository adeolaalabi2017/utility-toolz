import { cn } from "@/lib/utils";

export interface AdSlotProps {
  slot: "below-tool" | "beside-faq" | "inline";
  className?: string;
}

const ADS_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const SHOW_DEV_OUTLINE = process.env.NODE_ENV === "development";

/**
 * Ad placement (build plan §7.1): below the working tool and beside the FAQ,
 * never inside or above the tool.
 *
 * Renders nothing until NEXT_PUBLIC_ADSENSE_CLIENT is set, so visitors never
 * see an empty "ad space" box. In development a faint outline marks the slot
 * so layouts can still be checked.
 */
export function AdSlot({ slot, className }: AdSlotProps) {
  const size = cn(
    slot === "below-tool" && "min-h-[120px] sm:min-h-[140px]",
    slot === "beside-faq" && "min-h-[260px]",
    slot === "inline" && "min-h-[90px]"
  );

  if (!ADS_CLIENT) {
    if (!SHOW_DEV_OUTLINE) return null;
    return (
      <div
        aria-hidden
        data-ad-slot={slot}
        className={cn(
          "ad-slot my-6 flex w-full items-center justify-center rounded-xl border border-dashed border-border/70 text-[11px] text-muted-foreground",
          size,
          className
        )}
      >
        Ad slot “{slot}” · shown only in development
      </div>
    );
  }

  return (
    <aside
      aria-label="Advertisement"
      data-ad-slot={slot}
      className={cn("ad-slot my-6 flex w-full flex-col items-center justify-center", size, className)}
    >
      <span className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        Advertisement
      </span>
      {/* Mount the AdSense <ins> unit for this slot here when ads go live. */}
    </aside>
  );
}
