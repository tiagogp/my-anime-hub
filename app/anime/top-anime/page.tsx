
import { CardHome } from "@/components/card-home"
import { Pagination } from '@/components/ui/pagination'
import { api } from "@/config/api"
import { paginate } from '@/lib/utils'

interface Params {
  params: {}
  searchParams: {
    search?: string
    page?: string
  }
}



const perPage = 10

export default async function IndexPage({ searchParams }: Params) {
  const correctPage = !searchParams.page || Number(searchParams.page) === 0 ? 1 : Number(searchParams.page)

  const havePage = Number(searchParams.page) ? `&page=${correctPage}` : ""
  const { data } = await api.get(
    `/top/anime?sfw=true${havePage}`
  )

  const result = paginate(data.pagination.last_visible_page, correctPage, perPage);


  return (
    <section className="mx-auto mt-20 flex w-full max-w-screen-lg flex-col-reverse items-start gap-6 rounded-t-lg border bg-background pb-16 sm:flex-row sm:pb-0">
      <main className="flex-1">
        {data?.data?.map((item: any, index: number) => <CardHome
          {...item}
          index={25 * (Number(correctPage) > 0 ? Number(correctPage) - 1 : 0) + index + 1}
          key={item.mal_id}
          link={'/anime'}
        />)}

        <Pagination
          data={result}
          href='/anime/top-anime?page='
          currentPage={data.pagination.current_page}
          hasNextPage={data.pagination.has_next_page}
          initialPage={`/anime/top-anime?page=1`}
          lastPage={`/anime/top-anime?page=${data.pagination.last_visible_page}`}
          nextPage={`/anime/top-anime?page=${data.pagination.current_page + 1}`}
          previousPage={`/anime/top-anime?page=${data.pagination.current_page - 1}`} />
      </main>
    </section>
  )
}

