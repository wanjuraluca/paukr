import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/app", "/review", "/api", "/auth", "/konto", "/exams", "/upgrade"] },
    sitemap: "https://www.paukr.app/sitemap.xml",
  };
}
