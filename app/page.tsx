import Link from "next/link"

import { SITE_DESCRIPTION, SITE_NAME } from "@/config/seo"
import { getSessionNow, getSessionUpcoming } from "@/config/services/seasons"
import { getTopAnime } from "@/config/services/top"
import { absoluteUrl, pageMetadata } from "@/lib/seo"
import { formatterSessionUpcoming } from "@/lib/utils"
import { GalleryGrid } from "@/components/ui/gallery-grid"
import { CardHome } from "@/components/card-home"
import { RandomButton } from "@/components/random-button"
import { StructuredData } from "@/components/structured-data"

export const metadata = pageMetadata({
  title: "Discover Anime & Manga",
  description: SITE_DESCRIPTION,
  path: "/",
})

// Render at request time so build-time failures cannot freeze the home fallback.
// Individual AniList queries retain their one-hour server cache.
export const dynamic = "force-dynamic"

interface SectionProps {
  title: string
  moreHref: string
  children: React.ReactNode
}

const Section = ({ title, moreHref, children }: SectionProps) => (
  <section className="mx-auto w-full max-w-content px-4 py-16 sm:px-6 sm:py-24">
    <div className="mb-10 flex items-end justify-between gap-4 border-b border-border pb-4">
      <h2 className="font-display text-[1.75rem] leading-tight text-foreground sm:text-[2.5rem]">
        {title}
      </h2>
      <Link
        href={moreHref}
        className="shrink-0 font-mono text-xs uppercase tracking-[0.04em] text-muted-foreground transition-colors hover:text-foreground"
      >
        More →
      </Link>
    </div>
    {children}
  </section>
)

const SectionError = () => (
  <p className="font-mono text-sm text-muted-foreground">
    Unable to load this section. Please try again in a moment.
  </p>
)

export default async function IndexPage() {
  const [seasonNowResult, topAnimeResult, seasonUpcomingResult] =
    await Promise.allSettled([
      getSessionNow({
        limit: "10",
      }),
      getTopAnime({
        limit: "10",
      }),
      getSessionUpcoming({
        limit: "10",
      }),
    ])

  const seasonNowFailed = seasonNowResult.status === "rejected"
  const topAnimeFailed = topAnimeResult.status === "rejected"
  const seasonUpcomingFailed = seasonUpcomingResult.status === "rejected"

  const formattedSessionNow = seasonNowFailed
    ? []
    : formatterSessionUpcoming(seasonNowResult.value.data, 10)
  const formattedTopAnime = topAnimeFailed
    ? []
    : formatterSessionUpcoming(topAnimeResult.value.data, 10)
  const formattedSessionUpcoming = seasonUpcomingFailed
    ? []
    : formatterSessionUpcoming(seasonUpcomingResult.value.data, 10)

  return (
    <div>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: absoluteUrl("/"),
          description: SITE_DESCRIPTION,
          inLanguage: "en",
        }}
      />
      <header className="mx-auto flex w-full max-w-content flex-col gap-4 px-4 pb-4 pt-20 sm:px-6 sm:pt-28">
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
          An anime &amp; manga catalog
        </p>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <h1 className="font-display text-[2.25rem] leading-[1.05] text-foreground sm:text-[3.5rem]">
            What are you watching next?
          </h1>
          <RandomButton type="anime" className="shrink-0" />
        </div>
      </header>

      <Section title="Now Airing" moreHref="/anime/top-airing">
        {seasonNowFailed ? (
          <SectionError />
        ) : (
          <GalleryGrid>
            {formattedSessionNow.map((item, index) => (
              <CardHome
                {...item}
                headingLevel="h3"
                link="/anime"
                index={index + 1}
                key={item.mal_id}
              />
            ))}
          </GalleryGrid>
        )}
      </Section>

      <Section title="Upcoming" moreHref="/anime/top-upcoming">
        {seasonUpcomingFailed ? (
          <SectionError />
        ) : (
          <GalleryGrid>
            {formattedSessionUpcoming.map((item, index) => (
              <CardHome
                {...item}
                headingLevel="h3"
                link="/anime"
                index={index + 1}
                key={item.mal_id}
              />
            ))}
          </GalleryGrid>
        )}
      </Section>

      <Section title="Top Anime" moreHref="/anime/top-anime">
        {topAnimeFailed ? (
          <SectionError />
        ) : (
          <GalleryGrid>
            {formattedTopAnime.map((item, index) => (
              <CardHome
                {...item}
                headingLevel="h3"
                link="/anime"
                index={index + 1}
                key={item.mal_id}
              />
            ))}
          </GalleryGrid>
        )}
      </Section>
    </div>
  )
}
