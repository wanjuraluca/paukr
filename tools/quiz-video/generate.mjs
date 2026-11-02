import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { layoutFits, prepare, renderStill, renderVideo, timeline } from "./render.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..", "..");

const args = process.argv.slice(2);
function option(name, fallback) {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
}

const USAGE = `Quizvideos aus den freigegebenen Fragen erzeugen.

  npm run generate -- --exam fiae-ae --count 5
  npm run generate -- --list

Optionen:
  --exam <slug>    Prüfung, siehe --list
  --count <n>      Anzahl der Videos (Standard: 5)
  --topic <text>   Nur Themen, deren Name diesen Text enthält
  --stills         Nur Vorschaubilder statt Videos
`;

function query(sql) {
  // Without these flags the CLI prints a table in a normal terminal.
  const out = execSync(`npx supabase db query --linked --read-only --agent no --output-format json "${sql.replace(/\s+/g, " ")}"`, {
    cwd: repoRoot,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
    stdio: ["ignore", "pipe", "ignore"],
  });
  const start = out.indexOf("[");
  if (start < 0) throw new Error("Unerwartete Antwort von der Supabase-CLI.");
  return JSON.parse(out.slice(start));
}

function loadExams() {
  return query("select slug, name from exams where is_active order by sort_order");
}

function loadQuestions(slug) {
  return query(`
    select q.id, q.source_key, q.question_text, q.explanation, e.name as exam_name, t.name as topic,
      (select json_agg(json_build_object('text', o.option_text, 'isCorrect', o.is_correct)) from answer_options o where o.question_id = q.id) as options
    from questions q
    join topics t on t.id = q.topic_id
    join exams e on e.id = t.exam_id
    where e.slug = '${slug}' and e.is_active and q.reviewed and q.question_type = 'single'
      and q.explanation is not null and q.source_key is not null
  `);
}

// Same id gives the same order, so a video can be rendered again unchanged.
function seededShuffle(items, seedText) {
  let seed = 0;
  for (const ch of seedText) seed = (Math.imul(seed, 31) + ch.codePointAt(0)) | 0;
  const a = items.slice();
  // mulberry32, the low bits of a plain LCG put the right answer on the same letter.
  const next = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let z = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    z = (z + Math.imul(z ^ (z >>> 7), 61 | z)) ^ z;
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function toVideoQuestion(row) {
  return {
    key: row.source_key,
    examName: row.exam_name,
    topic: row.topic,
    text: row.question_text,
    explanation: row.explanation,
    options: seededShuffle(row.options, row.id),
  };
}

function caption(q) {
  return `Wie hättest du geantwortet? Schreib deinen Buchstaben in die Kommentare. Mehr Übungsfragen für ${q.examName}: Link im Profil. #ausbildung #abschlussprüfung #azubi #prüfungsvorbereitung #lernen`;
}

async function main() {
  if (args.includes("--help") || args.length === 0) {
    console.log(USAGE);
    return;
  }
  if (args.includes("--list")) {
    for (const e of loadExams()) console.log(`${e.slug.padEnd(20)} ${e.name}`);
    return;
  }

  const slug = option("exam");
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) throw new Error("Bitte --exam <slug> angeben, siehe --list.");
  const count = Number(option("count", "5"));
  if (!Number.isInteger(count) || count < 1) throw new Error("--count muss eine positive Zahl sein.");
  const topicFilter = option("topic")?.toLowerCase();
  const stills = args.includes("--stills");

  const outDir = join(here, "out", slug);
  mkdirSync(outDir, { recursive: true });
  // Remembers what was already rendered, so a later run brings new questions.
  const usedFile = join(outDir, "verwendet.json");
  const used = new Set(existsSync(usedFile) ? JSON.parse(readFileSync(usedFile, "utf8")) : []);

  const tools = await prepare();
  const rows = loadQuestions(slug);
  if (rows.length === 0) throw new Error(`Keine Fragen für "${slug}" gefunden, siehe --list.`);

  const candidates = seededShuffle(rows.map(toVideoQuestion), slug).filter(
    (q) =>
      !used.has(q.key) &&
      q.options.length >= 2 &&
      q.options.length <= 4 &&
      q.options.filter((o) => o.isCorrect).length === 1 &&
      (!topicFilter || q.topic.toLowerCase().includes(topicFilter)) &&
      // Questions pointing at another question make no sense on their own.
      !/(vorherigen|vorigen|obigen) (aufgabe|frage)/i.test(q.text) &&
      layoutFits(tools.ctx, q),
  );
  const picked = candidates.slice(0, count);
  if (picked.length === 0) throw new Error("Keine passenden Fragen mehr übrig.");
  if (picked.length < count) console.log(`Nur ${picked.length} passende Fragen übrig.`);

  const overview = [];
  for (const [i, q] of picked.entries()) {
    console.log(`[${i + 1}/${picked.length}] ${q.key}`);
    let file;
    if (stills) {
      const tl = timeline(q);
      file = `${q.key}-frage.png`;
      writeFileSync(join(outDir, file), await renderStill(tools, q, tl.reveal - 1));
      writeFileSync(join(outDir, `${q.key}-loesung.png`), await renderStill(tools, q, tl.outro - 0.5));
    } else {
      file = `${q.key}.mp4`;
      await renderVideo(tools, q, join(outDir, file));
      used.add(q.key);
    }
    overview.push(
      `## ${file}`,
      `Thema: ${q.topic}`,
      `Frage: ${q.text}`,
      ...q.options.map((o, n) => `- ${"ABCD"[n]}: ${o.text}${o.isCorrect ? " (richtig)" : ""}`),
      `Erklärung: ${q.explanation}`,
      `Text zum Posten: ${caption(q)}`,
      "",
    );
  }

  if (!stills) writeFileSync(usedFile, JSON.stringify([...used], null, 2));
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  const overviewFile = join(outDir, `uebersicht-${stamp}.md`);
  writeFileSync(overviewFile, `# ${picked[0].examName}\n\nVor dem Hochladen fachlich prüfen.\n\n${overview.join("\n")}`);
  console.log(`Fertig: ${outDir}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
