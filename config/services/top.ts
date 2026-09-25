import { listMedia, type ListParams } from "./anilist"

export const getTopAnime = (params: ListParams) => listMedia("ANIME", params)
export const getTopManga = (params: ListParams) => listMedia("MANGA", params)
export const getAnime = (params: ListParams) => listMedia("ANIME", params)
export const getManga = (params: ListParams) => listMedia("MANGA", params)
export const fetchMangaData = ({
  search,
  page,
  currentPage,
}: {
  search?: string
  page?: number
  currentPage?: number
}) => listMedia("MANGA", { q: search, page: currentPage || page, limit: "25" })
