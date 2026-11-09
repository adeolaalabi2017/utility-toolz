"use client";

import * as React from "react";
import { getCurrency, setCurrency, currencySymbol, CURRENCIES } from "@/lib/format";
import { Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const STORAGE_KEY = "utility_toolz_currency";

const CurrencyContext = React.createContext<{
  code: string;
  setCode: (code: string) => void;
}>({ code: "USD", setCode: () => {} });

/**
 * Holds the visitor's display currency. Formatting helpers read it from
 * lib/format and don't subscribe, so whichever component renders a tool or
 * calls them directly must call useCurrency() to re-render on a change.
 * Don't re-key the tree instead: a remount wipes inputs and loaded files.
 */
export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [code, setCodeState] = React.useState("USD");

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && CURRENCIES.some((c) => c.code === stored) && stored !== getCurrency()) {
        setCurrency(stored);
        setCodeState(stored);
      }
    } catch {
      // storage unavailable: stay on USD
    }
  }, []);

  const setCode = React.useCallback((next: string) => {
    setCurrency(next);
    setCodeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  }, []);

  return (
    <CurrencyContext.Provider value={{ code, setCode }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => React.useContext(CurrencyContext);

export function useCurrencySymbol(): string {
  const { code } = useCurrency();
  return currencySymbol(code);
}

/** Inline currency symbol for labels such as "Monthly burn (<Cur />)". */
export function Cur() {
  return <>{useCurrencySymbol()}</>;
}

export function CurrencySelect() {
  const { code, setCode } = useCurrency();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 px-2.5 text-sm font-medium text-foreground/80 hover:bg-accent hover:text-foreground"
          aria-label={`Display currency: ${code}. Change currency`}
        >
          <Coins className="h-4 w-4" aria-hidden />
          <span className="tnum">{code}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Currency shown in tools
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup value={code} onValueChange={setCode}>
          {CURRENCIES.map((c) => (
            <DropdownMenuRadioItem key={c.code} value={c.code} className="cursor-pointer">
              <span className="tnum w-10 font-medium">{c.code}</span>
              <span className="text-muted-foreground">{c.name}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
