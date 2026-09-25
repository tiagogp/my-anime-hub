import { listMedia } from "./anilist"
import type { Params } from "./types"

export const getSessionNow = (params: Params) =>
  listMedia("ANIME", { ...params, status: "airing", order_by: "popularity" })
export const getSessionUpcoming = (params: Params) =>
  listMedia("ANIME", { ...params, status: "upcoming", order_by: "popularity" })
