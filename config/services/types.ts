export interface SessionsProps {
  pagination: Pagination
  data: DataSessionProps[]
}

export interface DataSessionProps {
  cover_color?: string | null
  route_id?: string
  mal_id: number
  url: string
  images: Images
  trailer: Trailer
  approved: boolean
  titles: Title[]
  title: string
  title_english: string
  title_japanese: string
  title_synonyms: string[]
  type: string
  source: string
  episodes: number | null
  status: string
  airing: boolean
  aired: Aired
  duration: string
  rating: string
  score: number | null
  scored_by: number
  rank: number
  popularity: number
  members: number
  favorites: number
  chapters?: number
  volumes?: number
  authors?: RelationEntry[]
  serializations?: RelationEntry[]
  synopsis: string
  background: any
  season: string
  year: number
  broadcast: Broadcast
  producers: Producer[]
  licensors: any[]
  studios: Studio[]
  genres: Genre[]
  explicit_genres: any[]
  themes: Theme[]
  demographics: any[]
}
export interface Pagination {
  last_visible_page: number
  has_next_page: boolean
  current_page: number
  items: Items
}

export interface Items {
  count: number
  total: number
  per_page: number
}

export interface Images {
  jpg: Jpg
  webp: Webp
}

export interface Jpg {
  image_url: string
  small_image_url: string
  large_image_url: string
}

export interface Webp {
  image_url: string
  small_image_url: string
  large_image_url: string
}

export interface Trailer {
  youtube_id: string
  url: string
  embed_url: string
  images: Images2
}

export interface Images2 {
  image_url: string
  small_image_url: string
  medium_image_url: string
  large_image_url: string
  maximum_image_url: string
}

export interface Title {
  type: string
  title: string
}

export interface Aired {
  from: string
  to: string
  prop: Prop
  string: string
}

export interface Prop {
  from: From
  to: To
}

export interface From {
  day: number
  month: number
  year: number
}

export interface To {
  day: number
  month: number
  year: number
}

export interface Broadcast {
  day: string
  time: string
  timezone: string
  string: string
}

export interface Producer {
  mal_id: number
  type: string
  name: string
  url: string
}

export interface Studio {
  mal_id: number
  type: string
  name: string
  url: string
}

export interface Genre {
  mal_id: number
  type: string
  name: string
  url: string
}

export interface Theme {
  mal_id: number
  type: string
  name: string
  url: string
}

export interface Params {
  sfw?: boolean
  limit?: string
  page?: number
}

export interface RelationEntry {
  mal_id: number
  type: string
  name: string
  url: string
}

export interface Relation {
  relation: string
  entry: RelationEntry[]
}

export interface ExternalLink {
  name: string
  url: string
}

export interface AnimeFullExtra {
  relations: Relation[]
  external: ExternalLink[]
  streaming: ExternalLink[]
}

export interface CharacterPerson {
  mal_id: number
  url: string
  images: Images
  name: string
}

export interface VoiceActor {
  person: CharacterPerson
  language: string
}

export interface CharacterEntry {
  character: CharacterPerson
  role: string
  voice_actors?: VoiceActor[]
}

export interface StaffEntry {
  person: CharacterPerson
  positions: string[]
}

export interface RecommendationEntryData {
  route_id?: string
  mal_id: number
  url: string
  images: Images
  title: string
}

export interface RecommendationEntry {
  entry: RecommendationEntryData
  url: string
  votes: number
}

export interface ReviewUser {
  username: string
  url: string
  images: {
    jpg: {
      image_url: string
    }
  }
}

export interface ReviewEntry {
  mal_id: number
  url: string
  type: string
  reactions?: Record<string, number>
  date: string
  review: string
  score: number
  is_spoiler: boolean
  is_preliminary: boolean
  tags: string[]
  user: ReviewUser
}

export interface GenreEntry {
  mal_id: number
  name: string
  url: string
  count: number
}

export interface ScheduleEntry extends DataSessionProps {}

export interface CharactersResponse {
  data: CharacterEntry[]
}

export interface StaffResponse {
  data: StaffEntry[]
}

export interface RecommendationsResponse {
  data: RecommendationEntry[]
}

export interface ReviewsResponse {
  data: ReviewEntry[]
}

export interface GenresResponse {
  data: GenreEntry[]
}

export interface SchedulesResponse {
  pagination: Pagination
  data: ScheduleEntry[]
}

export interface RandomResponse {
  data: DataSessionProps & AnimeFullExtra
}
