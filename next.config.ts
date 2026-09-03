import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  ...(isGitHubPages
    ? {
        output: "export",
        trailingSlash: true,
        basePath: "/bytebrief",
      }
    : {}),
};

export default nextConfig;
