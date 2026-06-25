"use client";

import { usePathname } from "next/navigation";
import PageTransition from "@/components/layout/PageTransition";

export default function RootTemplate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Do not wrap admin routes in the global loader to preserve their snappy interface
  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }

  return <PageTransition>{children}</PageTransition>;
}
