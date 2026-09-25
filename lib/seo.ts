import type { Metadata } from "next"

import { IS_PREVIEW, SITE_NAME, SITE_URL } from "@/config/seo"
import type { DataSessionProps } from "@/config/services/types"

export const absoluteUrl = (path: string) => new URL(path, SITE_URL).toString()

export function summarize(text: string, fallback: string) {
  const clean = text.replace(/\s+/g, " ").trim() || fallback
  if (clean.length <= 160) return clean
  return `${clean
    .slice(0, 157)
    .replace(/\s+\S*$/, "")
    .trimEnd()}…`
}

export function pageMetadata({
  title,
  description,
  path,
  image = "/social-image",
  index = true,
}: {
  title: string
  description: string
  path: string
  image?: string
  index?: boolean
}): Metadata {
  const url = absoluteUrl(path)
  const socialTitle = `${title} | ${SITE_NAME}`
  return {
    title: { absolute: socialTitle },
    description,
    alternates: { canonical: url },
    robots: {
      index: index && !IS_PREVIEW,
      follow: true,
      googleBot: { "max-image-preview": "large", "max-snippet": -1 },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: SITE_NAME,
      title: socialTitle,
      description,
      url,
      images: [{ url: absoluteUrl(image), alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [absoluteUrl(image)],
    },
  }
}

export function catalogMetadata(
  path: string,
  title: string,
  description: string,
  params: Record<string, string | undefined>
) {
  const page = Number(params.page)
  const query = new URLSearchParams()
  const filters = ["search", "type", "status", "genres", "order_by", "sort"]
  for (const key of filters) {
    if (params[key]) query.set(key, params[key]!)
  }
  const filtered = query.size > 0
  if (Number.isSafeInteger(page) && page > 1) query.set("page", String(page))
  const suffix = query.has("page") ? ` – Page ${page}` : ""
  return pageMetadata({
    path: `${path}${query.size ? `?${query}` : ""}`,
    title: `${title}${suffix}`,
    description: `${description}${suffix ? ` Page ${page}.` : ""}`,
    index: !filtered,
  })
}

export function mediaMetadata(data: DataSessionProps, type: "anime" | "manga") {
  return pageMetadata({
    title: `${data.title} – ${type === "anime" ? "Anime" : "Manga"}`,
    description: summarize(
      data.synopsis,
      `Explore ${data.title}: synopsis, score, characters, and related ${type} on ${SITE_NAME}.`
    ),
    path: `/${type}/${data.route_id ?? data.mal_id}`,
    image: data.images.webp.large_image_url || "/social-image",
  })
}

export function mediaStructuredData(
  data: DataSessionProps,
  type: "anime" | "manga"
) {
  const url = absoluteUrl(`/${type}/${data.route_id ?? data.mal_id}`)
  const category = type === "anime" ? "Anime" : "Manga"
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type":
          type === "anime" && data.type === "MOVIE"
            ? "Movie"
            : type === "anime" && data.type === "TV"
            ? "TVSeries"
            : "CreativeWork",
        "@id": `${url}#work`,
        name: data.title,
        alternateName: [data.title_english, data.title_japanese].filter(
          (name) => name && name !== data.title
        ),
        url,
        mainEntityOfPage: url,
        description: data.synopsis || undefined,
        image: data.images.webp.large_image_url || undefined,
        genre: data.genres?.map((genre) => genre.name),
        sameAs: data.url || undefined,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: absoluteUrl("/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: category,
            item: absoluteUrl(`/${type}`),
          },
          { "@type": "ListItem", position: 3, name: data.title, item: url },
        ],
      },
    ],
  }
}

export const serializeJsonLd = (data: unknown) =>
  JSON.stringify(data).replace(/</g, "\\u003c")
