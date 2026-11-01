"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { HomePage } from "@/components/pages/home";

export default function RootPage() {
  const router = useRouter();

  // Backward compatibility: seamlessly redirect legacy hash routes (e.g. /#/finance/vat-calculator -> /finance/vat-calculator)
  React.useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const cleanPath = window.location.hash.replace(/^#\/?/, "/");
      // Only follow plain slug paths, so a crafted hash like "#//evil.com" can't
      // turn this into an open redirect to another origin.
      const [path, query] = cleanPath.split("?", 2);
      if (path !== "/" && /^(\/[a-z0-9-]+)+\/?$/i.test(path)) {
        router.replace(query ? `${path}?${query}` : path);
      }
    }
  }, [router]);

  return <HomePage />;
}
