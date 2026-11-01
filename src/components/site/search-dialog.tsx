"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ArrowRight, Search } from "lucide-react";
import { DOMAINS, PROFESSIONS, TOOLS } from "@/lib/registry";

const SearchContext = React.createContext<{
  open: boolean;
  setOpen: (v: boolean) => void;
}>({ open: false, setOpen: () => {} });

export const useSearch = () => React.useContext(SearchContext);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "/" && !open) {
        const target = e.target as HTMLElement;
        const typing =
          target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
        if (!typing) {
          e.preventDefault();
          setOpen(true);
        }
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open]);

  return (
    <SearchContext.Provider value={{ open, setOpen }}>
      {children}
      <SearchDialog />
    </SearchContext.Provider>
  );
}

function SearchDialog() {
  const { open, setOpen } = useSearch();
  const router = useRouter();

  const go = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Search tools"
      description="Type to filter tools, domains and professions, then press Enter to open one."
    >
      <CommandInput placeholder="Search tools, domains, professions…" />
      <CommandList className="thin-scroll max-h-[420px]">
        <CommandEmpty>
          No tools match that search. Try a general term like “margin”, “loan” or “tax”.
        </CommandEmpty>
        <CommandGroup heading="Tools">
          {TOOLS.map((t) => (
            <CommandItem
              key={t.slug}
              value={`${t.name} ${t.tags.join(" ")} ${t.category}`}
              onSelect={() => go(`/${t.domain}/${t.slug}`)}
            >
              <Search className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{t.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">{t.category}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Domains">
          {DOMAINS.map((d) => (
            <CommandItem
              key={d.slug}
              value={`${d.name} ${d.shortName}`}
              onSelect={() => go(`/${d.slug}`)}
            >
              <ArrowRight className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{d.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {d.status === "live" ? "Live" : `Phase ${d.phase}`}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Professions">
          {PROFESSIONS.map((p) => (
            <CommandItem
              key={p.slug}
              value={`${p.name} profession`}
              onSelect={() => go(`/professions/${p.slug}`)}
            >
              <ArrowRight className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{p.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
