"use client";

import { Search } from "lucide-react";
import { useSearch } from "./search-dialog";

export function NotFoundSearch() {
  const { setOpen } = useSearch();
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
    >
      <Search className="h-4 w-4" aria-hidden /> Search tools
    </button>
  );
}
