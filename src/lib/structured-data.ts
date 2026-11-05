import { SITE_URL } from "./seo";

// Only facts that are true for the product: no ratings, reviews or user counts.
const context = "https://schema.org";
const ORGANIZATION_ID = `${SITE_URL}/#organization`;

export function organization() {
  return {
    "@context": context,
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: "paukr",
    url: SITE_URL,
    logo: `${SITE_URL}/logo-512.png`,
    email: "info@paukr.app",
  };
}

export function website() {
  return {
    "@context": context,
    "@type": "WebSite",
    name: "paukr",
    url: SITE_URL,
    inLanguage: "de",
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export function softwareApplication() {
  return {
    "@context": context,
    "@type": "SoftwareApplication",
    name: "paukr",
    url: SITE_URL,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    inLanguage: "de",
    description: "Übungsfragen, Wiederholung falscher Antworten und Simulationen zur Vorbereitung auf Abschlussprüfungen in der Ausbildung.",
    offers: [
      { "@type": "Offer", name: "Free", price: "0", priceCurrency: "EUR" },
      { "@type": "Offer", name: "Pro", price: "9.99", priceCurrency: "EUR" },
    ],
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export function breadcrumbList(items: { name: string; path: string }[]) {
  return {
    "@context": context,
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function faqPage(items: { question: string; answer: string }[]) {
  return {
    "@context": context,
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function learningResource({ name, description, path, teaches }: { name: string; description: string; path: string; teaches: string[] }) {
  return {
    "@context": context,
    "@type": "LearningResource",
    name,
    description,
    url: `${SITE_URL}${path}`,
    inLanguage: "de",
    learningResourceType: "Übungsfragen",
    educationalLevel: "Berufsausbildung",
    teaches,
    isAccessibleForFree: true,
    provider: { "@id": ORGANIZATION_ID },
  };
}

export function article({ headline, description, path, published, modified }: { headline: string; description: string; path: string; published: string; modified: string }) {
  return {
    "@context": context,
    "@type": "Article",
    headline,
    description,
    mainEntityOfPage: `${SITE_URL}${path}`,
    inLanguage: "de",
    datePublished: published,
    dateModified: modified,
    author: { "@type": "Organization", name: "paukr", url: SITE_URL },
    publisher: { "@type": "Organization", name: "paukr", logo: { "@type": "ImageObject", url: `${SITE_URL}/logo-512.png` } },
  };
}
