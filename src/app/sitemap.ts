import type { MetadataRoute } from "next";
import { EXAM_AREAS, FIAE_PATH } from "@/lib/fiae";
import { loadPublicExams } from "@/lib/public-exams";
import { allArticles } from "@/lib/ratgeber";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const exams = await loadPublicExams();
  const pages: MetadataRoute.Sitemap = [
    "",
    "/pruefungen",
    ...exams.map((e) => `/pruefungen/${e.slug}`),
    FIAE_PATH,
    `${FIAE_PATH}/ap1`,
    `${FIAE_PATH}/ap2`,
    ...EXAM_AREAS.map((area) => `${FIAE_PATH}/ap2/${area.slug}`),
    "/preise",
    "/faq",
    "/ratgeber",
    "/agb",
    "/datenschutz",
    "/impressum",
    "/widerruf",
    "/kuendigen",
  ].map((path) => ({ url: `${SITE_URL}${path}` }));
  const articles = allArticles().map((a) => ({
    url: `${SITE_URL}/ratgeber/${a.slug}`,
    lastModified: a.modified,
  }));
  return [...pages, ...articles];
}
