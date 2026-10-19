import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/app/fonts";
import { profile } from "@/content/profile";
import "./globals.css";

const title = `${profile.name} - ${profile.title}`;
const description = profile.summary;

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: {
    default: title,
    template: `%s - ${profile.name}`,
  },
  description,
  applicationName: profile.name,
  authors: [{ name: profile.name, url: profile.siteUrl }],
  creator: profile.name,
  keywords: [
    "video editor",
    "post producer",
    "post production",
    "color grading",
    "DaVinci Resolve",
    "Knoxville",
    "Tennessee",
    "videographer",
    profile.name,
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: profile.siteUrl,
    siteName: profile.name,
    title,
    description,
    locale: "en_US",
    // og:image comes from app/opengraph-image.tsx (generated at build time).
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  // Icons come from app/icon.svg and app/apple-icon.tsx (file conventions).
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

/** JSON-LD Person schema, emitted once in the document head. */
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.title,
  email: `mailto:${profile.email}`,
  telephone: profile.phoneHref,
  url: profile.siteUrl,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Knoxville",
    addressRegion: "TN",
    addressCountry: "US",
  },
  knowsAbout: [
    "Video editing",
    "Post production",
    "Color grading",
    "Audio mixing",
    "Cinematography",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="min-h-dvh bg-ink antialiased">
        <script
          type="application/ld+json"
          // Static, author-controlled JSON built above - no user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
