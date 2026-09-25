import { cache } from "react"
import { parse } from "node-html-parser"

import type {
  AnimeFullExtra,
  CharacterEntry,
  DataSessionProps,
  RecommendationEntry,
  ReviewEntry,
  SessionsProps,
  StaffEntry,
} from "./types"

export const ENDPOINT = "https://graphql.anilist.co"

export class AniListError extends Error {
  constructor(message: string, public status: number) {
    super(message)
    this.name = "AniListError"
  }
}

// Shared server-side budget. Cached responses do not consume this queue.
let nextRequest = 0
export async function graphql<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const { unstable_cache } = await import("next/cache")
  return unstable_cache(
    async () => {
      const delay = Math.max(0, nextRequest - Date.now())
      if (delay > 60000)
        throw new AniListError(
          "Too many requests. Please try again shortly.",
          429
        )
      nextRequest = Math.max(Date.now(), nextRequest) + 2100
      await new Promise((resolve) => setTimeout(resolve, delay))
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 15000)
      try {
        const response = await fetch(ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ query, variables }),
          signal: controller.signal,
          cache: "no-store",
        })
        const body = await response.json().catch(() => null)
        if (!response.ok || body?.errors?.length || !body?.data) {
          if (response.status === 429)
            nextRequest = Math.max(
              nextRequest,
              Date.now() +
                Number(response.headers.get("Retry-After") || 60) * 1000
            )
          throw new AniListError(
            body?.errors?.[0]?.message || "AniList is unavailable",
            body?.errors?.[0]?.status || response.status
          )
        }
        return body.data as T
      } finally {
        clearTimeout(timer)
      }
    },
    ["anilist-v2", query, JSON.stringify(variables)],
    { revalidate: 3600 }
  )()
}

type Person = {
  id: number
  siteUrl: string
  name: { full: string }
  image: { large: string }
  languageV2?: string
}
export interface Media {
  isAdult: boolean
  id: number
  idMal: number | null
  siteUrl: string
  type: string
  format: string | null
  status: string | null
  title: { romaji: string; english: string | null; native: string | null }
  coverImage: {
    extraLarge: string
    large: string
    medium: string
    color?: string | null
  }
  description: string | null
  averageScore: number | null
  popularity: number
  favourites: number
  episodes: number | null
  chapters: number | null
  volumes: number | null
  duration: number | null
  genres: string[]
  season: string | null
  seasonYear: number | null
  source: string | null
  startDate: { year: number; month: number; day: number }
  endDate: { year: number; month: number; day: number }
  trailer: { id: string; site: string; thumbnail: string } | null
  rankings: { rank: number; type: string; allTime: boolean }[]
  studios?: { nodes: { id: number; name: string; siteUrl: string }[] }
  relations?: { edges: { relationType: string; node: Media }[] }
  externalLinks?: { site: string; url: string; type: string }[]
  characters?: {
    edges: { role: string; node: Person; voiceActors: Person[] }[]
  }
  staff?: { edges: { role: string; node: Person }[] }
  recommendations?: {
    nodes: { rating: number; mediaRecommendation: Media | null }[]
  }
  reviews?: {
    nodes: {
      id: number
      siteUrl: string
      summary: string
      score: number
      createdAt: number
      user: { name: string; siteUrl: string; avatar: { large: string } } | null
    }[]
  }
}

export const MEDIA_FIELDS = `isAdult id idMal siteUrl type format status title { romaji english native }
 coverImage { extraLarge large medium color } description(asHtml: false) averageScore popularity favourites
 episodes chapters volumes duration genres season seasonYear source
 startDate { year month day } endDate { year month day } trailer { id site thumbnail }
 rankings { rank type allTime } studios(isMain: true) { nodes { id name siteUrl } }`
const PERSON_FIELDS = `id siteUrl name { full } image { large }`
const DETAIL_FIELDS = `${MEDIA_FIELDS}
 relations { edges { relationType node { id idMal type siteUrl title { romaji } } } }
 externalLinks { site url type }
 characters(perPage: 12, sort: [ROLE, RELEVANCE, ID]) { edges { role node { ${PERSON_FIELDS} } voiceActors(language: JAPANESE) { ${PERSON_FIELDS} languageV2 } } }
 staff(perPage: 12, sort: [RELEVANCE, ID]) { edges { role node { ${PERSON_FIELDS} } } }
 recommendations(perPage: 4, sort: RATING_DESC) { nodes { rating mediaRecommendation { ${MEDIA_FIELDS} } } }
 reviews(perPage: 3, sort: RATING_DESC) { nodes { id siteUrl summary score createdAt user { name siteUrl avatar { large } } } }`

export const images = (large = "", medium = large) => ({
  jpg: { image_url: large, small_image_url: medium, large_image_url: large },
  webp: { image_url: large, small_image_url: medium, large_image_url: large },
})
const plain = (s: string | null) => parse(s || "").textContent
const label = (s: string | null) => (s || "").replaceAll("_", " ")
export const routeId = (m: Pick<Media, "id">) => `anilist-${m.id}`
export function mapMedia(m: Media): DataSessionProps & AnimeFullExtra {
  const youtube = m.trailer?.site === "youtube" ? m.trailer.id : ""
  const date = (d: Media["startDate"]) =>
    d?.year
      ? `${d.year}-${String(d.month || 1).padStart(2, "0")}-${String(
          d.day || 1
        ).padStart(2, "0")}`
      : ""
  return {
    mal_id: m.idMal ?? -m.id,
    route_id: routeId(m),
    cover_color: m.coverImage.color ?? null,
    url: m.siteUrl,
    images: images(
      m.coverImage.extraLarge || m.coverImage.large,
      m.coverImage.medium
    ),
    title: m.title.romaji || m.title.english || "Untitled",
    title_english: m.title.english || "",
    title_japanese: m.title.native || "",
    titles: [],
    title_synonyms: [],
    approved: true,
    type: label(m.format),
    source: label(m.source),
    episodes: m.episodes,
    chapters: m.chapters ?? undefined,
    volumes: m.volumes ?? undefined,
    status: label(m.status),
    airing: m.status === "RELEASING",
    duration: m.duration ? `${m.duration} min` : "",
    rating: "",
    score: m.averageScore == null ? null : m.averageScore / 10,
    scored_by: 0,
    rank: m.rankings?.find((r) => r.allTime && r.type === "RATED")?.rank || 0,
    popularity:
      m.rankings?.find((r) => r.allTime && r.type === "POPULAR")?.rank || 0,
    members: m.popularity || 0,
    favorites: m.favourites || 0,
    synopsis: plain(m.description),
    background: null,
    season: label(m.season),
    year: m.seasonYear || 0,
    aired: {
      from: date(m.startDate),
      to: date(m.endDate),
      prop: { from: m.startDate, to: m.endDate },
      string: date(m.startDate),
    },
    broadcast: { day: "", time: "", timezone: "UTC", string: "" },
    trailer: {
      youtube_id: youtube,
      url: youtube ? `https://www.youtube.com/watch?v=${youtube}` : "",
      embed_url: youtube ? `https://www.youtube.com/embed/${youtube}` : "",
      images: {
        image_url: m.trailer?.thumbnail || "",
        small_image_url: "",
        medium_image_url: "",
        large_image_url: "",
        maximum_image_url: "",
      },
    },
    genres: (m.genres || []).map((name, i) => ({
      mal_id: i + 1,
      name,
      type: "genre",
      url: "",
    })),
    studios: (m.studios?.nodes || []).map((s) => ({
      mal_id: s.id,
      name: s.name,
      url: s.siteUrl,
      type: "studio",
    })),
    authors: (m.staff?.edges || [])
      .filter((e) => /story|art|original creator/i.test(e.role))
      .map((e) => ({
        mal_id: e.node.id,
        name: e.node.name.full,
        url: e.node.siteUrl,
        type: "person",
      })),
    producers: [],
    licensors: [],
    explicit_genres: [],
    themes: [],
    demographics: [],
    relations: Object.entries(
      (m.relations?.edges || []).reduce<Record<string, Media[]>>((acc, e) => {
        ;(acc[e.relationType] ||= []).push(e.node)
        return acc
      }, {})
    ).map(([relation, nodes]) => ({
      relation: label(relation),
      entry: nodes.map((n) => ({
        mal_id: n.id,
        name: n.title.romaji,
        type: n.type.toLowerCase(),
        url: n.siteUrl,
      })),
    })),
    external: (m.externalLinks || [])
      .filter((l) => l.type !== "STREAMING")
      .map((l) => ({ name: l.site, url: l.url })),
    streaming: (m.externalLinks || [])
      .filter((l) => l.type === "STREAMING")
      .map((l) => ({ name: l.site, url: l.url })),
  }
}

export const getMedia = cache(async (type: "ANIME" | "MANGA", id: string) => {
  if (!/^(anilist-)?[1-9]\d*$/.test(id)) return null
  try {
    const result = await graphql<{ Media: Media | null }>(
      `query ($id: Int, $idMal: Int, $type: MediaType) { Media(id: $id, idMal: $idMal, type: $type) { ${DETAIL_FIELDS} } }`,
      {
        type,
        ...(id.startsWith("anilist-")
          ? { id: Number(id.slice(8)) }
          : { idMal: Number(id) }),
      }
    )
    return result.Media
  } catch (error) {
    if (error instanceof AniListError && error.status === 404) return null
    throw error
  }
})
const person = (p: Person) => ({
  mal_id: p.id,
  name: p.name.full,
  url: p.siteUrl,
  images: images(p.image.large),
})
export const characters = (m: Media | null): { data: CharacterEntry[] } => ({
  data: (m?.characters?.edges || []).map((e) => ({
    character: person(e.node),
    role: label(e.role),
    voice_actors: e.voiceActors.map((p) => ({
      person: person(p),
      language: p.languageV2 || "",
    })),
  })),
})
export const staff = (m: Media | null): { data: StaffEntry[] } => ({
  data: (m?.staff?.edges || []).map((e) => ({
    person: person(e.node),
    positions: [e.role],
  })),
})
export const recommendations = (
  m: Media | null
): { data: RecommendationEntry[] } => ({
  data: (m?.recommendations?.nodes || []).flatMap((e) =>
    e.mediaRecommendation
      ? [
          {
            entry: mapMedia(e.mediaRecommendation),
            url: e.mediaRecommendation.siteUrl,
            votes: e.rating,
          },
        ]
      : []
  ),
})
export const reviews = (m: Media | null): { data: ReviewEntry[] } => ({
  data: (m?.reviews?.nodes || [])
    .filter((e) => e.user)
    .map((e) => ({
      mal_id: e.id,
      url: e.siteUrl,
      type: m!.type,
      date: new Date(e.createdAt * 1000).toISOString(),
      review: plain(e.summary),
      score: e.score / 10,
      is_spoiler: false,
      is_preliminary: false,
      tags: [],
      user: {
        username: e.user!.name,
        url: e.user!.siteUrl,
        images: { jpg: { image_url: e.user!.avatar.large } },
      },
    })),
})

export interface ListParams {
  limit?: string
  page?: number
  sfw?: boolean
  q?: string
  type?: string
  status?: string
  genres?: string
  order_by?: string
  sort?: string
}
export async function listMedia(
  type: "ANIME" | "MANGA",
  params: ListParams = {}
): Promise<SessionsProps> {
  const formats: Record<string, string> = {
    tv: "TV",
    movie: "MOVIE",
    ova: "OVA",
    special: "SPECIAL",
    ona: "ONA",
    music: "MUSIC",
    manga: "MANGA",
    novel: "NOVEL",
    lightnovel: "NOVEL",
    oneshot: "ONE_SHOT",
  }
  const statuses: Record<string, string> = {
    airing: "RELEASING",
    publishing: "RELEASING",
    complete: "FINISHED",
    upcoming: "NOT_YET_RELEASED",
    hiatus: "HIATUS",
    discontinued: "CANCELLED",
  }
  const sorts: Record<string, string> = {
    score: "SCORE",
    rank: "SCORE",
    popularity: "POPULARITY",
    favorites: "FAVOURITES",
    title: "TITLE_ROMAJI",
    start_date: "START_DATE",
  }
  const page = Math.max(1, Math.floor(params.page || 1)),
    perPage = Math.min(50, Math.max(1, Number(params.limit) || 25))
  const sort = params.order_by
    ? `${sorts[params.order_by] || "SCORE"}${
        params.sort === "asc" ? "" : "_DESC"
      }`
    : params.q
    ? "SEARCH_MATCH"
    : "SCORE_DESC"
  const result = await graphql<{
    Page: {
      pageInfo: { currentPage: number; hasNextPage: boolean }
      media: Media[]
    }
  }>(
    `query ($type: MediaType, $page: Int, $perPage: Int, $search: String, $format: MediaFormat, $status: MediaStatus, $genres: [String], $sort: [MediaSort], $adult: Boolean) { Page(page: $page, perPage: $perPage) { pageInfo { currentPage hasNextPage } media(type: $type, search: $search, format: $format, status: $status, genre_in: $genres, sort: $sort, isAdult: $adult) { ${MEDIA_FIELDS} } } }`,
    {
      type,
      page,
      perPage,
      sort: [sort],
      // AniList currently returns empty general manga lists with isAdult: false.
      // Filter manga results below before exposing them to the UI.
      ...(params.sfw !== false && type === "ANIME" ? { adult: false } : {}),
      ...(params.q ? { search: params.q.slice(0, 200) } : {}),
      ...(params.type ? { format: formats[params.type.toLowerCase()] } : {}),
      ...(params.status ? { status: statuses[params.status] } : {}),
      ...(params.genres ? { genres: params.genres.split(",") } : {}),
    }
  )
  return {
    data: result.Page.media
      .filter((media) => params.sfw === false || media.isAdult === false)
      .map(mapMedia),
    pagination: pagination(
      page,
      perPage,
      result.Page.pageInfo.hasNextPage,
      result.Page.media.length
    ),
  }
}
// AniList does not provide a reliable total/last page. Only expose known pages.
export const pagination = (
  page: number,
  perPage: number,
  hasNext: boolean,
  count: number
) => ({
  current_page: page,
  has_next_page: hasNext,
  last_visible_page: page + (hasNext ? 1 : 0),
  items: { count, total: (page - 1) * perPage + count, per_page: perPage },
})
