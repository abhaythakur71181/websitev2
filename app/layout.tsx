import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { SiteHeader } from "@/components/site-header";
import { Statusline } from "@/components/statusline";
import { CommandPalette } from "@/components/command-palette";
import { KeyboardEffects } from "@/components/keyboard-effects";
import { site } from "@/lib/data/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [
    "Abhay Thakur",
    "abhaythakur71181",
    "software engineer",
    "backend engineer",
    "Java",
    "Spring Boot",
    "Rust",
    "TypeScript",
    "portfolio",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.name,
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": `${site.url}/rss.xml` },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
    { media: "(prefers-color-scheme: light)", color: "#faf9f7" },
  ],
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  alternateName: [site.alias, site.formerAlias],
  url: site.url,
  email: `mailto:${site.email}`,
  jobTitle: site.role,
  worksFor: { "@type": "Organization", name: site.company, url: site.companyUrl },
  sameAs: [site.links.github, site.links.linkedin, site.links.crates],
  knowsAbout: ["Java", "Spring Boot", "Apache Kafka", "Rust", "TypeScript", "Distributed Systems"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const goatcounter = process.env.NEXT_PUBLIC_GOATCOUNTER_CODE;
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <a
            href="#main"
            className="fixed left-4 top-4 z-[100] -translate-y-20 rounded bg-accent px-3 py-2 font-mono text-sm text-bg transition-transform focus:translate-y-0"
          >
            Skip to content
          </a>
          <SiteHeader />
          <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-5 pb-24 pt-10 sm:px-6">
            {children}
          </main>
          <Statusline />
          <CommandPalette />
          <KeyboardEffects />
        </ThemeProvider>
        {goatcounter ? (
          <script
            data-goatcounter={`https://${goatcounter}.goatcounter.com/count`}
            async
            src="https://gc.zgo.at/count.js"
          />
        ) : null}
      </body>
    </html>
  );
}
