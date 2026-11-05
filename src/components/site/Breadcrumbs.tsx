import Link from "next/link";
import { breadcrumbList } from "@/lib/structured-data";
import JsonLd from "./JsonLd";

export default function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  return (
    <>
      <JsonLd data={breadcrumbList(items)} />
      <nav aria-label="Brotkrumen" style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "14px" }}>
        {items.map((item, i) => (
          <span key={item.path}>
            {i > 0 && " / "}
            {i < items.length - 1 ? (
              <Link href={item.path} style={{ display: "inline-block", padding: "4px 0", color: "var(--accent-strong)", textDecoration: "underline", textUnderlineOffset: "2px" }}>
                {item.name}
              </Link>
            ) : (
              <span aria-current="page">{item.name}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
