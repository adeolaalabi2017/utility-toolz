"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export function useToolState<T extends Record<string, string | number | boolean>>(
  defaults: T
): [
  state: T,
  setState: (updates: Partial<T> | ((prev: T) => T)) => void,
  resetState: () => void,
  getShareUrl: () => string
] {
  // Lazy state initialization from window.location.search without triggering cascading renders in an effect
  const [state, setStateInternal] = useState<T>(() => {
    if (typeof window === "undefined") return defaults;
    try {
      const params = new URLSearchParams(window.location.search);
      const initial: Record<string, string | number | boolean> = { ...defaults };
      let hasCustom = false;

      Object.keys(defaults).forEach((key) => {
        if (params.has(key)) {
          const raw = params.get(key);
          if (raw !== null) {
            const defaultVal = defaults[key];
            if (typeof defaultVal === "number") {
              const numVal = Number(raw);
              if (!isNaN(numVal)) {
                initial[key] = numVal;
                hasCustom = true;
              }
            } else if (typeof defaultVal === "boolean") {
              initial[key] = raw === "true" || raw === "1";
              hasCustom = true;
            } else {
              initial[key] = raw;
              hasCustom = true;
            }
          }
        }
      });

      return hasCustom ? (initial as T) : defaults;
    } catch {
      return defaults;
    }
  });

  const isMountedRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Debounced URL state update
  const setState = useCallback(
    (updates: Partial<T> | ((prev: T) => T)) => {
      setStateInternal((prev) => {
        const next = typeof updates === "function" ? updates(prev) : { ...prev, ...updates };

        if (typeof window !== "undefined" && isMountedRef.current) {
          if (timerRef.current) clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => {
            const params = new URLSearchParams();
            Object.entries(next).forEach(([k, v]) => {
              if (v !== defaults[k] && v !== undefined && v !== "") {
                params.set(k, String(v));
              }
            });
            const query = params.toString();
            const newUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
            window.history.replaceState(null, "", newUrl);
          }, 300);
        }

        return next;
      });
    },
    [defaults]
  );

  // Reset to default parameters
  const resetState = useCallback(() => {
    setStateInternal(defaults);
    if (typeof window !== "undefined") {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [defaults]);

  // Get current permalink
  const getShareUrl = useCallback(() => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }, []);

  return [state, setState, resetState, getShareUrl];
}
