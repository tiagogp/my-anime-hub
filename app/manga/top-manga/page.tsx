import { getTopManga } from "@/config/services/top"
import { PAGES_LENGTH } from "@/lib/constants"
import { getCurrentPage, paginate } from "@/lib/utils"
import { GalleryGrid } from "@/components/ui/gallery-grid"
import { Pagination } from "@/components/ui/pagination"
import { CardHome } from "@/components/card-home"
import { CatalogNav } from "@/components/catalog-nav"

interface Params {
  searchParams: {
    search?: string
    page?: string
  }
}

export default async function IndexPage({ searchParams }: Params) {
  const currentPage = getCurrentPage(searchParams.page)
  const response = await getTopManga({ page: currentPage }).catch(() => null)

  const data = response?.data
  const pagination = response?.pagination

  const result = pagination
    ? paginate(pagination.last_visible_page, currentPage, PAGES_LENGTH)
    : []

  return (
    <section className="mx-auto w-full max-w-content px-4 pb-24 pt-12 sm:px-6 sm:pt-20">
      <CatalogNav type="manga" />
      <h1 className="mb-10 border-b border-border pb-4 font-display text-[1.75rem] leading-tight text-foreground sm:text-[2.5rem]">
        Top Manga
      </h1>

      {data?.length && pagination ? (
        <>
          <GalleryGrid>
            {data.map((item, index: number) => (
              <CardHome
                {...item}
                index={
                  25 * (Number(currentPage) > 0 ? Number(currentPage) - 1 : 0) +
                  index +
                  1
                }
                key={item.mal_id}
                link={"/manga"}
              />
            ))}
          </GalleryGrid>

          <Pagination
            data={result}
            href="/manga/top-manga?page="
            currentPage={pagination.current_page}
            hasNextPage={pagination.has_next_page}
            initialPage={`/manga/top-manga?page=1`}
            lastPage={`/manga/top-manga?page=${pagination.last_visible_page}`}
            nextPage={`/manga/top-manga?page=${pagination.current_page + 1}`}
            previousPage={`/manga/top-manga?page=${
              pagination.current_page - 1
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
