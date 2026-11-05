import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// /auth and /upgrade stay crawlable on purpose: they carry noindex, and a
// crawler that is blocked here could never see that tag.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/app", "/konto", "/review"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
