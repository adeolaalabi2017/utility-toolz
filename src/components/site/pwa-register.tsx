"use client";

import * as React from "react";
import { WifiOff, Wifi } from "lucide-react";

export function PwaRegister() {
  const [isOffline, setIsOffline] = React.useState(false);
  const [showReconnected, setShowReconnected] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Register service worker
    const registerSw = () => {
      navigator.serviceWorker
        .register("/sw.js")
        .catch((err) => console.debug("ServiceWorker registration failed:", err));
    };
    const canRegister = "serviceWorker" in navigator && process.env.NODE_ENV === "production";
    // This effect can run after the load event, which would then never fire.
    if (canRegister) {
      if (document.readyState === "complete") registerSw();
      else window.addEventListener("load", registerSw, { once: true });
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
      window.removeEventListener("load", registerSw);
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
          <span className="flex h-2 w-2 rounded-full bg-lf-orange animate-pulse" />
          <WifiOff className="h-3.5 w-3.5 text-deep-orange" />
          <span>Offline mode · Tools run 100% locally</span>
        </>
      ) : (
        <>
          <span className="flex h-2 w-2 rounded-full bg-lf-green" />
          <Wifi className="h-3.5 w-3.5 text-deep-green" />
          <span>Connected back online</span>
        </>
      )}
    </div>
  );
}
