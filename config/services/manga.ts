import {
  characters,
  getMedia,
  mapMedia,
  recommendations,
  reviews,
  staff,
} from "./anilist"

export const getMangaById = async (id: string) => {
  const media = await getMedia("MANGA", id)
  return { data: media ? mapMedia(media) : null }
}
export const getMangaCharacters = async (id: string) =>
  characters(await getMedia("MANGA", id))
export const getMangaStaff = async (id: string) =>
  staff(await getMedia("MANGA", id))
export const getMangaRecommendations = async (id: string) =>
  recommendations(await getMedia("MANGA", id))
export const getMangaReviews = async (id: string) =>
  reviews(await getMedia("MANGA", id))
