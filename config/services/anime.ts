import {
  characters,
  getMedia,
  mapMedia,
  recommendations,
  reviews,
  staff,
} from "./anilist"

export const getAnimeById = async (id: string) => {
  const media = await getMedia("ANIME", id)
  return { data: media ? mapMedia(media) : null }
}
export const getAnimeCharacters = async (id: string) =>
  characters(await getMedia("ANIME", id))
export const getAnimeStaff = async (id: string) =>
  staff(await getMedia("ANIME", id))
export const getAnimeRecommendations = async (id: string) =>
  recommendations(await getMedia("ANIME", id))
export const getAnimeReviews = async (id: string) =>
  reviews(await getMedia("ANIME", id))
