import Link from "next/link"

import {
  WEEKDAYS,
  getSchedules,
  type Weekday,
} from "@/config/services/schedules"
import { pageMetadata } from "@/lib/seo"
import { cn } from "@/lib/utils"
import { GalleryGrid } from "@/components/ui/gallery-grid"
import { CardHome } from "@/components/card-home"

interface Params {
  searchParams: {
    day?: string
  }
}

const isWeekday = (value?: string): value is Weekday =>
  Boolean(value && (WEEKDAYS as readonly string[]).includes(value))

const todayWeekday = (): Weekday => {
  const index = new Date().getUTCDay()
  return WEEKDAYS[(index + 6) % 7]
}

export function generateMetadata({ searchParams }: Params) {
  const day = isWeekday(searchParams.day) ? searchParams.day : undefined
  const label = day
    ? `${day[0].toUpperCase()}${day.slice(1)} Anime Schedule`
    : "Weekly Anime Schedule"
  return pageMetadata({
    title: label,
    description:
      "Follow the weekly anime airing schedule in UTC. Browse each day’s releases and find series to watch on MyAnimeHub.",
    path: day ? `/schedule?day=${day}` : "/schedule",
  })
}

export default async function SchedulePage({ searchParams }: Params) {
  const activeDay = isWeekday(searchParams.day)
    ? searchParams.day
    : todayWeekday()

  const response = await getSchedules({ filter: activeDay, limit: "25" }).catch(
    () => null
  )
  const data = response?.data

  return (
    <section className="mx-auto w-full max-w-content px-4 pb-24 pt-12 sm:px-6 sm:pt-20">
      <h1 className="mb-10 border-b border-border pb-4 font-display text-[1.75rem] leading-tight text-foreground sm:text-[2.5rem]">
        Weekly Schedule (UTC)
      </h1>

      <nav className="mb-10 flex flex-wrap gap-2" aria-label="Day of the week">
        {WEEKDAYS.map((day) => (
          <Link
            key={day}
            href={`/schedule?day=${day}`}
            aria-current={activeDay === day ? "date" : undefined}
            aria-label={day}
            className={cn(
              "border border-border px-3 py-2 font-mono text-xs uppercase tracking-[0.04em] text-foreground transition-colors hover:border-foreground",
              activeDay === day &&
                "bg-foreground text-background hover:border-foreground"
            )}
          >
            {day.slice(0, 3)}
          </Link>
        ))}
      </nav>

      {data?.length ? (
        <GalleryGrid>
          {data.map((item, index) => (
            <CardHome
              {...item}
              index={index + 1}
              key={item.mal_id}
              link="/anime"
            />
          ))}
        </GalleryGrid>
      ) : (
        <p className="py-16 text-center text-sm text-muted-foreground">
          {response
            ? "Nothing scheduled for this day."
            : "Unable to load right now. Please try again later."}
        </p>
      )}
    </section>
  )
}
