"use client";

import type { CSSProperties, ReactNode } from "react";
import { sourceFrom } from "@/lib/signup-source";

// A real link into the app. It names the page it sits on as the signup source,
// unless the visitor came through a marked link, for example from an ad.
export default function AppLink({
  source,
  className,
  style,
  ariaLabel,
  children,
}: {
  source?: string;
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={source ? `/app?src=${source}` : "/app"}
      onClick={(e) => {
        const fromLink = sourceFrom(new URLSearchParams(window.location.search));
        if (fromLink) e.currentTarget.href = `/app?src=${fromLink}`;
      }}
      aria-label={ariaLabel}
      className={className}
      style={{ textDecoration: "none", ...style }}
    >
      {children}
    </a>
  );
}
