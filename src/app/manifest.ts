import type { MetadataRoute } from "next";
import { siteBasePath } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "United Higher / Lower",
    short_name: "United H/L",
    description: "A game for the United faithful.",
    start_url: `${siteBasePath}/`,
    display: "standalone",
    background_color: "#f5f3ec",
    theme_color: "#911d2b",
    icons: [
      {
        src: `${siteBasePath}/icon.svg`,
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
