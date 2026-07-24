import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Exam } from "@/lib/types";

export default async function ExamsPage() {
  const supabase = await createClient();
  const { data: exams, error } = await supabase
    .from("exams")
    .select("id, slug, name, description, sort_order, topics(id, slug, name, is_premium, sort_order)")
    .order("sort_order")
    .returns<Exam[]>();

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-20 dark:bg-black">
      <main className="w-full max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Welche Prüfung bereitest du vor?
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Wähle eine Prüfung aus, um mit Übungsmodus und Prüfungssimulation zu starten.
        </p>

        {error ? (
          <p className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            Prüfungen konnten nicht geladen werden: {error.message}
          </p>
        ) : null}

        {!error && exams?.length === 0 ? (
          <p className="mt-8 text-zinc-600 dark:text-zinc-400">
            Noch keine Prüfungen verfügbar.
          </p>
        ) : null}

        <ul className="mt-8 flex flex-col gap-4">
          {exams?.map((exam) => (
            <li key={exam.id}>
              <Link
                href={`/exams/${exam.slug}`}
                className="block rounded-xl border border-zinc-200 bg-white p-6 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
              >
                <h2 className="text-xl font-medium text-black dark:text-zinc-50">
                  {exam.name}
                </h2>
                {exam.description ? (
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {exam.description}
                  </p>
                ) : null}
                <p className="mt-3 text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
                  {exam.topics.length}{" "}
                  {exam.topics.length === 1 ? "Themengebiet" : "Themengebiete"}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
