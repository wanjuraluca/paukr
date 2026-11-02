"use client";

import { sourceFrom } from "@/lib/signup-source";

// Links into the app and names the page as the signup source, unless the
// visitor came here through a marked link, for example from an ad.
export default function ExamCta({ source, label }: { source: string; label: string }) {
  return (
    <a
      href={`/app?src=${source}`}
      onClick={(e) => {
        const fromLink = sourceFrom(new URLSearchParams(window.location.search));
        if (fromLink) e.currentTarget.href = `/app?src=${fromLink}`;
      }}
      className="pk-scale-btn-sm"
      style={{ display: "inline-block", fontWeight: 600, fontSize: "15.5px", padding: "13px 24px", borderRadius: "13px", background: "var(--accent)", color: "var(--on-accent)", textDecoration: "none" }}
    >
      {label}
    </a>
  );
}
