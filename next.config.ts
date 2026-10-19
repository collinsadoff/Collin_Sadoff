import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: `next build` emits a fully static site into ./out
  output: "export",
  // Required for static export — no Next.js image optimization server.
  images: { unoptimized: true },
  // Emits /resume/index.html so Netlify serves /resume without a redirect.
  trailingSlash: true,
};

export default nextConfig;
