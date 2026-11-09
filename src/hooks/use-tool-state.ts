"use client";

import { useState, useEffect, useLayoutEffect, useCallback, useRef } from "react";

// Parse share-link query params over the defaults; null when the URL carries none
function readUrlState<T extends Record<string, string | number | boolean>>(defaults: T): T | null {
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

    return hasCustom ? (initial as T) : null;
  } catch {
    return null;
  }
}

export function useToolState<T extends Record<string, string | number | boolean>>(
  defaults: T
): [
  state: T,
  setState: (updates: Partial<T> | ((prev: T) => T)) => void,
  resetState: () => void,
  getShareUrl: () => string
] {
  // Start from defaults so the first client render matches the prerendered HTML
  const [state, setStateInternal] = useState<T>(defaults);

  // Only visitor edits write to the URL, not defaults or share-link params on load.
  const editedRef = useRef(false);
  const defaultsRef = useRef(defaults);

  // Apply share-link params after hydration but before paint, so defaults never flash
  useLayoutEffect(() => {
    const fromUrl = readUrlState(defaults);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- URL is only readable after hydration
    if (fromUrl) setStateInternal(fromUrl);
    // Defaults are usually inline literals; read the URL once on mount
  }, []);

  // Debounced URL state update
  useEffect(() => {
    if (!editedRef.current) return;
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      Object.entries(state).forEach(([k, v]) => {
        if (v !== defaultsRef.current[k] && v !== undefined && v !== "") {
          params.set(k, String(v));
        }
      });
      const query = params.toString();
      const newUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
      window.history.replaceState(null, "", newUrl);
    }, 300);
    return () => clearTimeout(timer);
  }, [state]);

  const setState = useCallback((updates: Partial<T> | ((prev: T) => T)) => {
    editedRef.current = true;
    setStateInternal((prev) => (typeof updates === "function" ? updates(prev) : { ...prev, ...updates }));
  }, []);

  // Reset to default parameters
  const resetState = useCallback(() => {
    editedRef.current = false;
    setStateInternal(defaults);
    if (typeof window !== "undefined") {
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
