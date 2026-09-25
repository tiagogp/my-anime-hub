import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import {
  getAnimeById,
  getAnimeCharacters,
  getAnimeRecommendations,
  getAnimeReviews,
  getAnimeStaff,
} from "@/config/services/anime"
import { mediaMetadata, mediaStructuredData } from "@/lib/seo"
import { getYoutubeIdFromEmbedUrl } from "@/lib/utils"
import { CategoryLabel } from "@/components/ui/category-label"
import { Video } from "@/components/ui/video"
import { ExternalLinks } from "@/components/anime/external-links"
import { CharactersRail, StaffRail } from "@/components/anime/people-grid"
import { RecommendationsGrid } from "@/components/anime/recommendations-grid"
import { RelationsList } from "@/components/anime/relations-list"
import { ReviewsList } from "@/components/anime/reviews-list"
import { BackgroundImage } from "@/components/background-image"
import { Image } from "@/components/custom-image"
import { StructuredData } from "@/components/structured-data"

interface Params {
  params: {
    id?: string
  }
}

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data } = await getAnimeById(params.id)
  if (!data) notFound()
  return mediaMetadata(data, "anime")
}

interface DetailSectionProps {
  title: string
  children: React.ReactNode
}

const DetailSection = ({ title, children }: DetailSectionProps) => (
  <section className="border-t border-border py-12">
    <h2 className="mb-8 font-display text-[1.5rem] leading-tight text-foreground">
      {title}
    </h2>
    {children}
  </section>
)

export default async function IndexPage({ params }: Params) {
  if (!params.id) {
    return notFound()
  }

  const [
    { data },
    charactersResponse,
    staffResponse,
    recommendationsResponse,
    reviewsResponse,
  ] = await Promise.all([
    getAnimeById(params.id),
    getAnimeCharacters(params.id),
    getAnimeStaff(params.id),
    getAnimeRecommendations(params.id),
    getAnimeReviews(params.id),
  ])

  if (!data?.mal_id) {
    return notFound()
  }

  const videoId = getYoutubeIdFromEmbedUrl(data.trailer?.embed_url)

  return (
    <>
      <StructuredData data={mediaStructuredData(data, "anime")} />
      {data.images.webp.large_image_url && (
        <BackgroundImage
          alt={data.title}
          color={data.cover_color}
          src={data.images.webp.large_image_url}
        />
      )}

      <article className="relative z-20 mx-auto w-full max-w-content px-4 pb-24 pt-12 sm:px-6 sm:pt-[28vh]">
        <div className="mb-12 flex w-full flex-col gap-8 sm:flex-row">
          <div className="flex w-full max-w-40 flex-col gap-4 sm:w-56 sm:max-w-56 sm:shrink-0">
            <div className="relative aspect-[3/4] w-full overflow-hidden border border-border bg-card">
              <Image
                src={data.images.webp.large_image_url}
                alt={data.title}
                lazy={false}
                fetchPriority="high"
                width={224}
                height={300}
                className="absolute inset-0 size-full object-cover"
              />
            </div>

            {data.studios?.length ? (
              <div>
                <CategoryLabel>
                  {data.studios.length > 1 ? "Studios" : "Studio"}
                </CategoryLabel>
                <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1">
                  {data.studios.map((studio: any) => (
                    <Link
                      target="_blank"
                      key={studio.mal_id}
                      href={studio.url}
                      className="text-sm text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
                    >
                      {studio.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-6">
            <div>
              <h1 className="font-display text-[2rem] leading-[1.1] text-foreground sm:text-[2.75rem]">
                {data.title}
              </h1>
              {data.title_english && data.title_english !== data.title ? (
                <p className="mt-1 font-mono text-sm text-muted-foreground">
                  {data.title_english}
                </p>
              ) : null}
            </div>

            {data.genres?.length ? (
              <div className="flex flex-wrap gap-2">
                {data.genres.map((genre: any) => (
                  <CategoryLabel
                    key={genre.mal_id}
                    className="border border-border px-2 py-1"
                  >
                    {genre.name}
                  </CategoryLabel>
                ))}
              </div>
            ) : null}

            <dl className="flex flex-wrap gap-x-6 gap-y-2 border-y border-border py-4 font-mono text-xs text-muted-foreground">
              <div className="flex items-baseline gap-1.5">
                <dt className="uppercase tracking-[0.08em]">Score</dt>
                <dd className="text-foreground">{data.score ?? "N/A"}</dd>
              </div>
              <div className="flex items-baseline gap-1.5">
                <dt className="uppercase tracking-[0.08em]">Rank</dt>
                <dd className="text-foreground">
                  {data.rank ? `#${data.rank}` : "N/A"}
                </dd>
              </div>
              <div className="flex items-baseline gap-1.5">
                <dt className="uppercase tracking-[0.08em]">Popularity</dt>
                <dd className="text-foreground">
                  {data.popularity ? `#${data.popularity}` : "N/A"}
                </dd>
              </div>
              <div className="flex items-baseline gap-1.5">
                <dt className="uppercase tracking-[0.08em]">Members</dt>
                <dd className="text-foreground">
                  {data.members?.toLocaleString("en-US")}
                </dd>
              </div>
              <div className="flex items-baseline gap-1.5">
                <dt className="uppercase tracking-[0.08em]">Status</dt>
                <dd className="text-foreground">{data.status}</dd>
              </div>
              <div className="flex items-baseline gap-1.5">
                <dt className="uppercase tracking-[0.08em]">Episodes</dt>
                <dd className="text-foreground">{data.episodes ?? "N/A"}</dd>
              </div>
              <div className="flex items-baseline gap-1.5">
                <dt className="uppercase tracking-[0.08em]">Type</dt>
                <dd className="text-foreground">{data.type}</dd>
              </div>
            </dl>

            <p className="max-w-[68ch] text-sm leading-relaxed text-foreground/90">
              {data.synopsis || "No synopsis available yet."}
            </p>

            {videoId && (
              <div className="w-full max-w-sm">
                <Video id={videoId} title={data?.title ?? ""} />
              </div>
            )}
          </div>
        </div>

        {charactersResponse.data?.length || staffResponse.data?.length ? (
          <DetailSection title="Characters & Staff">
            <div className="flex flex-col gap-10">
              {charactersResponse.data?.length ? (
                <CharactersRail characters={charactersResponse.data} />
              ) : null}
              {staffResponse.data?.length ? (
                <StaffRail staff={staffResponse.data} />
              ) : null}
            </div>
          </DetailSection>
        ) : null}

        {data.relations?.length ? (
          <DetailSection title="Relations">
            <RelationsList relations={data.relations} />
          </DetailSection>
        ) : null}

        {recommendationsResponse.data?.length ? (
          <DetailSection title="Recommendations">
            <RecommendationsGrid
              recommendations={recommendationsResponse.data}
              link="/anime"
            />
          </DetailSection>
        ) : null}

        {data.streaming?.length || data.external?.length ? (
          <DetailSection title="Where to Watch">
            <ExternalLinks
              streaming={data.streaming}
              external={data.external}
            />
          </DetailSection>
        ) : null}

        {reviewsResponse.data?.length ? (
          <DetailSection title="Reviews">
            <ReviewsList reviews={reviewsResponse.data} />
          </DetailSection>
        ) : null}
      </article>
    </>
  )
}
