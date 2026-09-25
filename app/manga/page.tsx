import Link from "next/link"

import { getMangaGenres } from "@/config/services/genres"
import { getManga } from "@/config/services/top"
import { PAGES_LENGTH } from "@/lib/constants"
import { getCurrentPage, paginate } from "@/lib/utils"
import { GalleryGrid } from "@/components/ui/gallery-grid"
import { Pagination } from "@/components/ui/pagination"
import { CardHome } from "@/components/card-home"
import { CatalogNav } from "@/components/catalog-nav"
import { FilterBar } from "@/components/filter-bar"
import { RandomButton } from "@/components/random-button"

interface Params {
  searchParams: {
    search?: string
    page?: string
    type?: string
    status?: string
    genres?: string
    order_by?: string
    sort?: string
  }
}

export default async function IndexPage({ searchParams }: Params) {
  const { search, page, type, status, genres, order_by, sort } = searchParams

  const currentPage = getCurrentPage(page)

  const [data, genresResponse] = await Promise.all([
    getManga({
      limit: "25",
      ...(search && { q: search }),
      ...(type && { type }),
      ...(status && { status }),
      ...(genres && { genres }),
      ...(order_by && { order_by }),
      ...(sort && { sort }),
      ...(Number(page) && { page: currentPage }),
    }).catch(() => null),
    getMangaGenres().catch(() => ({ data: [] })),
  ])

  const result = data?.pagination
    ? paginate(data.pagination.last_visible_page, currentPage, PAGES_LENGTH)
    : []

  const linkParams = new URLSearchParams()
  if (search) linkParams.set("search", search)
  if (type) linkParams.set("type", type)
  if (status) linkParams.set("status", status)
  if (genres) linkParams.set("genres", genres)
  if (order_by) linkParams.set("order_by", order_by)
  if (sort) linkParams.set("sort", sort)

  const pageHref = (pageNumber: number) => {
    const withPage = new URLSearchParams(linkParams)
    withPage.set("page", String(pageNumber))
    return `/manga?${withPage.toString()}`
  }

  return (
    <section className="mx-auto w-full max-w-content px-4 pb-24 pt-12 sm:px-6 sm:pt-20">
      <CatalogNav type="manga" />
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
        <h1 className="font-display text-[1.75rem] leading-tight text-foreground sm:text-[2.5rem]">
          Browse Manga
        </h1>
        <RandomButton type="manga" />
      </div>

      {search && (
        <p className="mb-6 break-words text-sm text-muted-foreground">
          Results for <span className="text-foreground">“{search}”</span>
          {" · "}
          <Link href="/manga" className="underline underline-offset-4">
            Clear search
          </Link>
        </p>
      )}

      <div className="mb-10">
        <FilterBar
          type="manga"
          basePath="/manga"
          genres={genresResponse.data}
        />
      </div>

      {data?.data?.length ? (
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
              link={"/manga"}
            />
          ))}
        </GalleryGrid>
      ) : (
        <p className="py-16 text-center text-sm text-muted-foreground">
          {data
            ? "No results found."
            : "Unable to load right now. Please try again later."}
        </p>
      )}

      {Boolean(data?.data?.length) && data?.pagination && (
        <Pagination
          href={`/manga?${linkParams.toString()}${
            linkParams.toString() ? "&" : ""
          }page=`}
          data={result}
          currentPage={data.pagination.current_page}
          hasNextPage={data.pagination.has_next_page}
          initialPage={pageHref(1)}
          previousPage={pageHref(data.pagination.current_page - 1)}
          lastPage={pageHref(data.pagination.last_visible_page)}
          nextPage={pageHref(data.pagination.current_page + 1)}
        />
      )}
    </section>
  )
}
