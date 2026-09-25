import { getTopAnime } from "@/config/services/top"
import { PAGES_LENGTH } from "@/lib/constants"
import { catalogMetadata } from "@/lib/seo"
import { getCurrentPage, paginate } from "@/lib/utils"
import { GalleryGrid } from "@/components/ui/gallery-grid"
import { Pagination } from "@/components/ui/pagination"
import { CardHome } from "@/components/card-home"
import { CatalogNav } from "@/components/catalog-nav"

interface Params {
  params: {}
  searchParams: {
    search?: string
    page?: string
  }
}

export function generateMetadata({ searchParams }: Params) {
  return catalogMetadata(
    "/anime/top-anime",
    "Top-Rated Anime",
    "Discover top-rated anime series and movies, compare scores, and explore characters, synopses, and recommendations.",
    searchParams
  )
}

export default async function IndexPage({ searchParams }: Params) {
  const currentPage = getCurrentPage(searchParams.page)

  const data = await getTopAnime({
    limit: "25",
    ...(Number(searchParams.page) && { page: currentPage }),
  }).catch(() => null)

  const result = data?.pagination
    ? paginate(data.pagination.last_visible_page, currentPage, PAGES_LENGTH)
    : []

  return (
    <section className="mx-auto w-full max-w-content px-4 pb-24 pt-12 sm:px-6 sm:pt-20">
      <CatalogNav type="anime" />
      <h1 className="mb-10 border-b border-border pb-4 font-display text-[1.75rem] leading-tight text-foreground sm:text-[2.5rem]">
        Top Anime
      </h1>

      {data?.data?.length ? (
        <>
          <GalleryGrid>
            {data.data.map((item: any, index: number) => (
              <CardHome
                {...item}
                index={
                  25 * (Number(currentPage) > 0 ? Number(currentPage) - 1 : 0) +
                  index +
                  1
                }
                key={item.mal_id}
                link={"/anime"}
              />
            ))}
          </GalleryGrid>

          <Pagination
            data={result}
            href="/anime/top-anime?page="
            currentPage={data.pagination.current_page}
            hasNextPage={data.pagination.has_next_page}
            initialPage={`/anime/top-anime?page=1`}
            lastPage={`/anime/top-anime?page=${data.pagination.last_visible_page}`}
            nextPage={`/anime/top-anime?page=${
              data.pagination.current_page + 1
            }`}
            previousPage={`/anime/top-anime?page=${
              data.pagination.current_page - 1
            }`}
          />
        </>
      ) : (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Unable to load right now. Please try again later.
        </p>
      )}
    </section>
  )
}
