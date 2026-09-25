"use server"

import { listMedia } from "./anilist"

export async function searchMedia(type: "anime" | "manga", search: string) {
  if (!search.trim()) return { data: [], haveMore: false }
  const result = await listMedia(type === "manga" ? "MANGA" : "ANIME", {
    q: search,
    limit: "10",
  })
  return { data: result.data, haveMore: result.pagination.has_next_page }
}
