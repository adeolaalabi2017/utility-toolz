"use client";

import * as React from "react";
import { WifiOff, Wifi } from "lucide-react";

export function PwaRegister() {
  const [isOffline, setIsOffline] = React.useState(false);
  const [showReconnected, setShowReconnected] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Register service worker
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .catch((err) => console.debug("ServiceWorker registration failed:", err));
      });
    }

    // 2. Monitor online/offline state
    const handleOnline = () => {
      setIsOffline(false);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowReconnected(false);
    };

    if (!navigator.onLine) {
      setIsOffline(true);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline && !showReconnected) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="no-print fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium shadow-lg backdrop-blur transition-all animate-in fade-in slide-in-from-bottom-2 bg-card/95 border-border text-foreground"
    >
      {isOffline ? (
        <>
          <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          <WifiOff className="h-3.5 w-3.5 text-amber-500" />
          <span>Offline mode · Tools run 100% locally</span>
        </>
      ) : (
        <>
          <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
          <Wifi className="h-3.5 w-3.5 text-emerald-500" />
          <span>Connected back online</span>
        </>
      )}
    </div>
  );
}
