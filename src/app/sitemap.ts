import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/agb", "/datenschutz", "/impressum", "/widerruf", "/kuendigen"].map((path) => ({
    url: `https://www.paukr.app${path}`,
  }));
}
