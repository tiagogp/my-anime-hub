"use server"

import { listMedia } from "./anilist"

async function random(type: "ANIME" | "MANGA") {
  // Pick from a bounded, reusable pool rather than probing nonexistent IDs.
  let { data } = await listMedia(type, {
    limit: "50",
    page: 1 + Math.floor(Math.random() * 5),
    order_by: "popularity",
  })
  if (!data.length) {
    const firstPage = await listMedia(type, {
      limit: "50",
      page: 1,
      order_by: "popularity",
    })
    data = firstPage.data
  }
  const selected = data[Math.floor(Math.random() * data.length)]
  if (!selected) throw new Error("No titles available")
  return { data: selected }
}
export async function getRandomAnime() {
  return random("ANIME")
}
export async function getRandomManga() {
  return random("MANGA")
}
