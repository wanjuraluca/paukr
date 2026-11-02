import type { MetadataRoute } from "next";
import { loadPublicExams } from "@/lib/public-exams";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const exams = await loadPublicExams();
  return [
    "",
    "/pruefungen",
    ...exams.map((e) => `/pruefungen/${e.slug}`),
    "/agb",
    "/datenschutz",
    "/impressum",
    "/widerruf",
    "/kuendigen",
  ].map((path) => ({
    url: `https://www.paukr.app${path}`,
  }));
}
