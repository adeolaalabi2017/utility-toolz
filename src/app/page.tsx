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
      if (cleanPath && cleanPath !== "/") {
        router.replace(cleanPath);
      }
    }
  }, [router]);

  return <HomePage />;
}
