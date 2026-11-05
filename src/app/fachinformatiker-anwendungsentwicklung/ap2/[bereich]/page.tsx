import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import CtaBox from "@/components/site/CtaBox";
import JsonLd from "@/components/site/JsonLd";
import SampleQuestions from "@/components/site/SampleQuestions";
import SiteShell from "@/components/site/SiteShell";
import { EXAM_AREAS, FIAE_PATH, FIAE_SLUG, LAW_URL } from "@/lib/fiae";
import { loadTopicSamples } from "@/lib/public-exams";
import { pageMetadata } from "@/lib/seo";
import { learningResource } from "@/lib/structured-data";

export const revalidate = 3600;
export const dynamicParams = false;

const AP2_PATH = `${FIAE_PATH}/ap2`;

export function generateStaticParams() {
  return EXAM_AREAS.map((area) => ({ bereich: area.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ bereich: string }> }): Promise<Metadata> {
  const { bereich } = await params;
  const area = EXAM_AREAS.find((a) => a.slug === bereich);
  if (!area) return {};
  return pageMetadata({ title: area.title, description: area.description, path: `${AP2_PATH}/${area.slug}` });
}

export default async function ExamAreaPage({ params }: { params: Promise<{ bereich: string }> }) {
  const { bereich } = await params;
  const area = EXAM_AREAS.find((a) => a.slug === bereich);
  if (!area) notFound();
  const path = `${AP2_PATH}/${area.slug}`;
  const samples = await loadTopicSamples(FIAE_SLUG, area.samples);
  const others = EXAM_AREAS.filter((a) => a.slug !== area.slug);
  const source = `fiae-${area.slug.slice(0, 24)}`;

  return (
    <SiteShell source={source}>
      <JsonLd data={learningResource({ name: area.heading, description: area.description, path, teaches: [area.heading] })} />
      <Breadcrumbs
        items={[
          { name: "Startseite", path: "/" },
          { name: "Fachinformatiker Anwendungsentwicklung", path: FIAE_PATH },
          { name: "AP2", path: AP2_PATH },
          { name: area.heading, path },
        ]}
      />
      <h1>{area.heading}</h1>
      <p className="pk-lead">{area.lead}</p>
      <p>
        <strong>{area.facts}</strong>
      </p>

      <h2>Was geprüft wird</h2>
      <p>{area.skillsIntro}</p>
      <ul>
        {area.skills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
      <p>
        Grundlage ist die <a href={LAW_URL} rel="noopener">Fachinformatikerausbildungsverordnung</a>. Die Bestehensregeln stehen auf der Seite zur <Link href={AP2_PATH}>AP2</Link>.
      </p>

      <h2>{area.tipsHeading}</h2>
      {area.tips.map((tip) => (
        <div key={tip.title}>
          <h3>{tip.title}</h3>
          <p>{tip.text}</p>
        </div>
      ))}

      <h2>Beispielfragen</h2>
      <p>{area.samplesIntro}</p>
      <SampleQuestions questions={samples} />
      <CtaBox source={source} title={area.ctaTitle} text={area.ctaText} />

      <h2>Weitere Bereiche der AP2</h2>
      <ul>
        {others.map((other) => (
          <li key={other.slug}>
            <Link href={`${AP2_PATH}/${other.slug}`}>{other.heading}</Link>
          </li>
        ))}
        <li>
          <Link href="/ratgeber/betriebliche-projektarbeit">Betriebliche Projektarbeit</Link>
        </li>
      </ul>
    </SiteShell>
  );
}
