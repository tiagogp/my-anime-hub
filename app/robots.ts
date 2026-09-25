import type { MetadataRoute } from "next"

import { IS_PREVIEW } from "@/config/seo"
import { absoluteUrl } from "@/lib/seo"

export default function robots(): MetadataRoute.Robots {
  if (IS_PREVIEW) return { rules: { userAgent: "*", disallow: "/" } }
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  }
}
