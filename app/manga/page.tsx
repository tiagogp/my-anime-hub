import { fetchMangaData, getManga, getTopManga } from "@/config/services/top"
import { PAGES_LENGTH } from "@/lib/constants"
import { formatterUrl, getCurrentPage, paginate } from "@/lib/utils"
import { Pagination } from "@/components/ui/pagination"
import { CardHome } from "@/components/card-home"

export const revalidate = 3600

interface Params {
  searchParams: {
    search?: string
    page?: string
    id?: string
  }
}

export default async function IndexPage({ searchParams }: Params) {
  const baseHref = "/manga?page="
  const search = searchParams.search
  const currentPage = getCurrentPage(searchParams.page)

  const { data, pagination } = await fetchMangaData({
    currentPage,
    search,
    page: Number(searchParams.page),
  })

  const { current_page, has_next_page, last_visible_page } = pagination

  const result = paginate(
    pagination.last_visible_page,
    currentPage,
    PAGES_LENGTH
  )

  return (
    <section className="mx-auto mt-20 flex w-full max-w-screen-lg flex-col-reverse items-start gap-6 rounded-t-lg border-x border-t bg-background pb-16 sm:flex-row sm:pb-0">
      <main className="flex-1 ">
        {data?.map((item: any, index: number) => (
          <CardHome
            {...item}
            link={"/manga"}
            index={++index}
            key={item.mal_id}
          />
        ))}
        <Pagination
          href={baseHref}
          data={result}
          search={search}
          currentPage={current_page}
          hasNextPage={has_next_page}
          initialPage={formatterUrl(search, 1)}
          previousPage={formatterUrl(search, current_page - 1)}
          lastPage={formatterUrl(search, last_visible_page)}
          nextPage={formatterUrl(search, current_page + 1)}
        />
      </main>
    </section>
  )
}
