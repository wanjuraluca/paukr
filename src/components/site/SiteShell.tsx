import type { ReactNode } from "react";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import { ThemeRoot } from "./Theme";

// Frame of the public content pages, with reading width and text styles.
export default function SiteShell({ source, children }: { source?: string; children: ReactNode }) {
  return (
    <ThemeRoot style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100dvh" }}>
      <SiteHeader source={source} />
      <main className="pk-prose" style={{ maxWidth: "760px", margin: "0 auto", padding: "40px 24px 72px" }}>
        {children}
      </main>
      <SiteFooter />
    </ThemeRoot>
  );
}
