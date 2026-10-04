import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const pagesOrigin = "https://mesql1.github.io/portfolio_luiz";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  assetPrefix: isGitHubPages ? pagesOrigin : "",
  images: { unoptimized: true },
};

export default nextConfig;
