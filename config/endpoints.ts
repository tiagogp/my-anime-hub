export const AnimeEndpoints = {
  animeFullById: "/anime/{id}/full",
  animeById: "/anime/{id}",
  animeCharacters: "/anime/{id}/characters",
  animeStaff: "/anime/{id}/staff",
  animeEpisodes: "/anime/{id}/episodes",
  animeEpisodeById: "/anime/{id}/episodes/{episode}",
  animeNews: "/anime/{id}/news",
  animeForum: "/anime/{id}/forum",
  animeVideos: "/anime/{id}/videos",
  animeVideosEpisodes: "/anime/{id}/videos/episodes",
  animePictures: "/anime/{id}/pictures",
  animeStatistics: "/anime/{id}/statistics",
  animeMoreInfo: "/anime/{id}/moreinfo",
  animeRecommendations: "/anime/{id}/recommendations",
  animeUserUpdates: "/anime/{id}/userupdates",
  animeReviews: "/anime/{id}/reviews",
  animeRelations: "/anime/{id}/relations",
  animeThemes: "/anime/{id}/themes",
  animeExternal: "/anime/{id}/external",
  animeStreaming: "/anime/{id}/streaming",
  animeSearch: "/anime",
} as const

export const MangaEndpoints = {
  mangaSearch: "/manga",
  mangaFullById: "/manga/{id}/full",
  mangaById: "/manga/{id}",
  mangaCharacters: "/manga/{id}/characters",
  mangaNews: "/manga/{id}/news",
  mangaTopics: "/manga/{id}/forum",
  mangaPictures: "/manga/{id}/pictures",
  mangaStatistics: "/manga/{id}/statistics",
  mangaMoreInfo: "/manga/{id}/moreinfo",
  mangaRelations: "/manga/{id}/relations",
  mangaExternal: "/manga/{id}/external",
  mangaRecommendations: "/manga/{id}/recommendations",
  mangaUserUpdates: "/manga/{id}/userupdates",
  mangaReviews: "/manga/{id}/reviews",
} as const

export const CharactersEndpoints = {
  characterFullById: "/characters/{id}/full",
  characterById: "/characters/{id}",
  characterAnime: "/characters/{id}/anime",
  characterManga: "/characters/{id}/manga",
  characterVoiceActors: "/characters/{id}/voices",
  characterPictures: "/characters/{id}/pictures",
  characterSearch: "/characters",
} as const

export const PeopleEndpoints = {
  personFullById: "/people/{id}/full",
  personById: "/people/{id}",
  personAnime: "/people/{id}/anime",
  personVoices: "/people/{id}/voices",
  personManga: "/people/{id}/manga",
  personPictures: "/people/{id}/pictures",
  peopleSearch: "/people",
} as const

export const ClubsEndpoints = {
  clubById: "/clubs/{id}",
  clubMembers: "/clubs/{id}/members",
  clubStaff: "/clubs/{id}/staff",
  clubRelations: "/clubs/{id}/relations",
  clubSearch: "/clubs",
} as const

export const ProducersEndpoints = {
  producerFullById: "/producers/{id}/full",
  producerById: "/producers/{id}",
  producerExternal: "/producers/{id}/external",
  producersSearch: "/producers",
} as const

export const GenresEndpoints = {
  animeGenres: "/genres/anime",
  mangaGenres: "/genres/manga",
} as const

export const MagazinesEndpoints = {
  magazines: "/magazines",
} as const

export const RandomEndpoints = {
  randomAnime: "/random/anime",
  randomManga: "/random/manga",
  randomCharacters: "/random/characters",
  randomPeople: "/random/people",
  randomUsers: "/random/users",
} as const

export const RecommendationsEndpoints = {
  recentAnimeRecommendations: "/recommendations/anime",
  recentMangaRecommendations: "/recommendations/manga",
} as const

export const ReviewsEndpoints = {
  animeReviews: "/reviews/anime",
  mangaReviews: "/reviews/manga",
} as const

export const SchedulesEndpoints = {
  schedules: "/schedules",
} as const

export const SeasonsEndpoints = {
  season: "/seasons/{year}/{season}",
  seasonNow: "/seasons/now",
  seasonsList: "/seasons",
  seasonUpcoming: "/seasons/upcoming",
} as const

export const TopEndpoints = {
  topAnime: "/top/anime",
  topManga: "/top/manga",
  topCharacters: "/top/characters",
  topPeople: "/top/people",
  topReviews: "/top/reviews",
} as const

export const WatchEndpoints = {
  watchRecentEpisodes: "/watch/episodes",
  watchPopularEpisodes: "/watch/episodes/popular",
  watchRecentPromos: "/watch/promos",
  watchPopularPromos: "/watch/promos/popular",
} as const
