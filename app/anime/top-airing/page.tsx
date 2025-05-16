import { api } from "@/config/api"
import { PAGES_LENGTH } from "@/lib/constants"
import { getCurrentPage, paginate } from "@/lib/utils"
import { Pagination } from "@/components/ui/pagination"
import { CardHome } from "@/components/card-home"

interface Params {
  params: {}
  searchParams: {
    search?: string
    page?: string
  }
}

export default async function IndexPage({ searchParams }: Params) {
  const currentPage = getCurrentPage(searchParams.page)

  const havePage = Number(searchParams.page) ? `&page=${currentPage}` : ""
  const { data } = await api.get(`/seasons/now?sfw=true${havePage}`)

  const result = paginate(
    data.pagination.last_visible_page,
    currentPage,
    PAGES_LENGTH
  )

  return (
    <section className="mx-auto mt-20 flex w-full max-w-screen-lg flex-col-reverse items-start gap-6 rounded-t-lg border bg-background pb-16 sm:flex-row sm:pb-0">
      <main className="flex-1">
        {data?.data?.map((item: any, index: number) => (
          <CardHome
            {...item}
            index={
              25 * (Number(currentPage) > 0 ? Number(currentPage) - 1 : 0) +
              index +
              1
            }
            link={"/anime"}
            key={item.mal_id}
          />
        ))}
        <Pagination
          data={result}
          href="/anime/top-airing?page="
          currentPage={data.pagination.current_page}
          hasNextPage={data.pagination.has_next_page}
          initialPage={`/anime/top-airing?page=1`}
          lastPage={`/anime/top-airing?page=${data.pagination.last_visible_page}`}
          nextPage={`/anime/top-airing?page=${
            data.pagination.current_page + 1
          }`}
          previousPage={`/anime/top-airing?page=${
            data.pagination.current_page - 1
          }`}
        />
      </main>
    </section>
  )
}
