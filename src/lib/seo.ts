import type { Metadata } from "next";

export const SITE_URL = "https://www.paukr.app";
const SITE_NAME = "paukr";
const SHARE_IMAGE = { url: "/opengraph-image", width: 1200, height: 630, alt: "paukr: Übungsfragen für deine Abschlussprüfung" };

// A page that sets openGraph replaces the whole field from the layout, so every
// public page goes through here and gets its own canonical and social tags.
export function pageMetadata({
  title,
  description,
  path,
  publishedTime,
  modifiedTime,
}: {
  title: string;
  description: string;
  path: string;
  publishedTime?: string;
  modifiedTime?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: "de_DE",
      images: [SHARE_IMAGE],
      ...(publishedTime ? { type: "article", publishedTime, modifiedTime } : { type: "website" }),
    },
    twitter: { card: "summary_large_image", title, description, images: [SHARE_IMAGE] },
  };
}

export function noindexMetadata(title: string): Metadata {
  return { title, robots: { index: false, follow: false } };
}
