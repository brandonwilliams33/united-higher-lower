import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  output: "export",
  trailingSlash: true,
  ...(process.env.GITHUB_PAGES === "true"
    ? { basePath: "/united-higher-lower" }
    : {}),
};

export default nextConfig;
