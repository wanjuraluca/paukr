import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { marked } from "marked";

export interface Article {
  slug: string;
  title: string;
  heading: string;
  description: string;
  published: string;
  modified: string;
  body: string;
}

const DIR = join(process.cwd(), "src", "content", "ratgeber");

function parse(file: string): Article {
  const raw = readFileSync(join(DIR, file), "utf8").replace(/\r\n/g, "\n");
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`${file} has no front matter`);
  const fields = Object.fromEntries(
    match[1].split("\n").map((line) => {
      const at = line.indexOf(":");
      return [line.slice(0, at).trim(), line.slice(at + 1).trim()];
    }),
  );
  return {
    slug: file.replace(/\.md$/, ""),
    title: fields.title,
    heading: fields.heading,
    description: fields.description,
    published: fields.published,
    modified: fields.modified ?? fields.published,
    body: match[2],
  };
}

export function allArticles(): Article[] {
  return readdirSync(DIR)
    .filter((file) => file.endsWith(".md"))
    .map(parse)
    .sort((a, b) => b.published.localeCompare(a.published) || a.slug.localeCompare(b.slug));
}

export function articleHtml(article: Article): string {
  return marked.parse(article.body, { async: false });
}
