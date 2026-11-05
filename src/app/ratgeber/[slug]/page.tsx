import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import CtaBox from "@/components/site/CtaBox";
import JsonLd from "@/components/site/JsonLd";
import SiteShell from "@/components/site/SiteShell";
import { allArticles, articleHtml } from "@/lib/ratgeber";
import { pageMetadata } from "@/lib/seo";
import { article as articleData } from "@/lib/structured-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return allArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = allArticles().find((a) => a.slug === slug);
  if (!article) return {};
  return pageMetadata({
    title: article.title,
    description: article.description,
    path: `/ratgeber/${article.slug}`,
    publishedTime: article.published,
    modifiedTime: article.modified,
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const articles = allArticles();
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();
  const path = `/ratgeber/${article.slug}`;
  const source = `ratgeber-${article.slug.slice(0, 28)}`;
  const date = new Date(article.modified).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

  return (
    <SiteShell source={source}>
      <JsonLd data={articleData({ headline: article.heading, description: article.description, path, published: article.published, modified: article.modified })} />
      <Breadcrumbs items={[{ name: "Startseite", path: "/" }, { name: "Ratgeber", path: "/ratgeber" }, { name: article.heading, path }]} />
      <h1>{article.heading}</h1>
      <p style={{ color: "var(--muted)", fontSize: "14px" }}>Stand: {date}</p>
      {/* Our own Markdown files from the repo, rendered at build time. */}
      <div dangerouslySetInnerHTML={{ __html: articleHtml(article) }} />
      <CtaBox source={source} title="Wissen direkt testen" text="Übe mit eigenen Fragen und Erklärungen. Falsche Antworten kommen automatisch wieder." />

      <h2>Mehr aus dem Ratgeber</h2>
      <ul>
        {articles
          .filter((a) => a.slug !== article.slug)
          .map((a) => (
            <li key={a.slug}>
              <Link href={`/ratgeber/${a.slug}`}>{a.heading}</Link>
            </li>
          ))}
      </ul>
    </SiteShell>
  );
}
