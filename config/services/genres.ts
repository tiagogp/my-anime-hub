import { graphql } from "./anilist"

export async function getAnimeGenres() {
  const result = await graphql<{ GenreCollection: string[] }>(
    "{ GenreCollection }"
  )
  return {
    data: result.GenreCollection.filter((name) => name !== "Hentai").map(
      (name, i) => ({ mal_id: i + 1, name, url: "", count: 0 })
    ),
  }
}
export const getMangaGenres = getAnimeGenres
