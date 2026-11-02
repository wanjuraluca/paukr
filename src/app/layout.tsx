import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Space_Grotesk } from "next/font/google";
import "./globals.css";

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.paukr.app"),
  title: "paukr: Übungsfragen zur Prüfungsvorbereitung",
  description: "Lerne mit eigenen Übungsfragen, Wiederholung nach Lernstand und Simulationen für deine Abschlussprüfung. Kostenlos starten.",
  openGraph: {
    title: "paukr: Übungsfragen zur Prüfungsvorbereitung",
    description: "Lernen, üben, Prüfung simulieren. Kostenlos starten.",
    url: "/",
    siteName: "paukr",
    locale: "de_DE",
    type: "website",
  },
};

// Colours the phone's browser bar to match the page in light and dark mode.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1118" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${hankenGrotesk.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
