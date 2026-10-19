import type { MetadataRoute } from "next";
import { profile } from "@/content/profile";

/**
 * Static export writes this to out/sitemap.xml at build time.
 * Add a route here whenever you add a page.
 */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: `${profile.siteUrl}/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${profile.siteUrl}/resume/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
