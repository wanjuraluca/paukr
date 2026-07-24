import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Exam } from "@/lib/types";

export default async function ExamPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: exam } = await supabase
    .from("exams")
    .select("id, slug, name, description, sort_order, topics(id, slug, name, is_premium, sort_order)")
    .eq("slug", slug)
    .order("sort_order", { referencedTable: "topics" })
    .single<Exam>();

  if (!exam) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-20 dark:bg-black">
      <main className="w-full max-w-2xl">
        <Link
          href="/"
          className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          &larr; Alle Prüfungen
        </Link>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          {exam.name}
        </h1>
        {exam.description ? (
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">{exam.description}</p>
        ) : null}

        <h2 className="mt-8 text-lg font-medium text-black dark:text-zinc-50">
          Themengebiete
        </h2>
        <ul className="mt-4 flex flex-col gap-3">
          {exam.topics.map((topic) => (
            <li
              key={topic.id}
              className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span className="text-black dark:text-zinc-50">{topic.name}</span>
              {topic.is_premium ? (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                  Pro
                </span>
              ) : null}
            </li>
          ))}
        </ul>

        <p className="mt-10 text-sm text-zinc-500 dark:text-zinc-500">
          Übungsmodus folgt als nächster Schritt.
        </p>
      </main>
    </div>
  );
}
