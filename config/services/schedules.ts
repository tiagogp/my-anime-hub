import {
  MEDIA_FIELDS,
  graphql,
  mapMedia,
  pagination,
  type Media,
} from "./anilist"

export const WEEKDAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const
export type Weekday = (typeof WEEKDAYS)[number]
export async function getSchedules({
  filter,
  sfw = true,
  limit = "25",
}: {
  filter?: Weekday
  sfw?: boolean
  limit?: string
}) {
  // Calendar days use UTC consistently in the query and day selector.
  const start = new Date()
  start.setUTCHours(0, 0, 0, 0)
  const weekday = (start.getUTCDay() + 6) % 7
  start.setUTCDate(
    start.getUTCDate() - weekday + (filter ? WEEKDAYS.indexOf(filter) : weekday)
  )
  const from = Math.floor(start.getTime() / 1000)
  const result = await graphql<{
    Page: { airingSchedules: { media: Media }[] }
  }>(
    `query ($from: Int, $to: Int) { Page(page: 1, perPage: 50) { airingSchedules(airingAt_greater: $from, airingAt_lesser: $to, sort: TIME) { media { ${MEDIA_FIELDS} } } } }`,
    { from: from - 1, to: from + 86400 }
  )
  const seen = new Set<number>()
  const data = result.Page.airingSchedules
    .map((e) => e.media)
    .filter((m) => {
      if ((sfw && m.isAdult) || seen.has(m.id)) return false
      seen.add(m.id)
      return true
    })
    .slice(0, Number(limit))
    .map(mapMedia)
  return { data, pagination: pagination(1, Number(limit), false, data.length) }
}
