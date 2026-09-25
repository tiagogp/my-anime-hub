import type { MetadataRoute } from "next"

import { getSessionNow, getSessionUpcoming } from "@/config/services/seasons"
import { getTopAnime, getTopManga } from "@/config/services/top"
import { absoluteUrl } from "@/lib/seo"

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = [
    "/",
    "/anime",
    "/manga",
    "/anime/top-anime",
    "/anime/top-airing",
    "/anime/top-upcoming",
    "/manga/top-manga",
    "/schedule",
  ]
  const results = await Promise.allSettled([
    getTopAnime({ limit: "50" }),
    getTopManga({ limit: "50" }),
    getSessionNow({ limit: "25" }),
    getSessionUpcoming({ limit: "25" }),
  ])
  results.forEach((result, index) => {
    if (result.status !== "fulfilled") return
    const type = index === 1 ? "manga" : "anime"
    for (const item of result.value.data)
      paths.push(`/${type}/${item.route_id ?? item.mal_id}`)
  })
  return Array.from(new Set(paths)).map((path) => ({ url: absoluteUrl(path) }))
}
