export const siteBasePath =
  process.env.GITHUB_PAGES === "true" ? "/united-higher-lower" : "";

const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const siteUrl = configuredSiteUrl.replace(/\/$/, "");
export const siteTitle =
  "United Higher or Lower — Manchester United Football Game";
export const siteDescription =
  "A fast Higher or Lower game for Manchester United fans. Compare players across appearances, goals, transfer fees and United careers.";
