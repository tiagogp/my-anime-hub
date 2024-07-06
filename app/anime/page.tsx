
import { CardHome } from "@/components/card-home"
import { Pagination } from '@/components/ui/pagination'
import { api } from "@/config/api"
import { paginate } from '@/lib/utils'
import { redirect } from 'next/navigation'

interface Params {
  params: {}
  searchParams: {
    search?: string
    page?: string
    id?: string
  }
}

const perPage = 10

export default async function IndexPage({ searchParams }: Params) {
  if (searchParams.search) {
    const correctPage = !searchParams.page || Number(searchParams.page) === 0 ? 1 : Number(searchParams.page)

    const havePage = Number(searchParams.page) ? `&page=${correctPage}` : ""
    const { data } = await api.get(
      `/anime?q=${searchParams.search}${havePage}&sfw=true`
    )

    const result = paginate(data.pagination.last_visible_page, correctPage, perPage);

    return (
      <section className="mx-auto mt-20 flex w-full max-w-screen-lg flex-col-reverse items-start gap-6 rounded-t-lg border-x border-t bg-background pb-16 sm:flex-row sm:pb-0">
        <main className="flex-1">
          {data?.data?.map((item: any, index: number) => (
            <CardHome
              {...item}
              index={25 * (Number(correctPage) > 0 ? Number(correctPage) - 1 : 0) + index + 1}
              key={item.mal_id}
              link={'/anime'}
            />
          ))}
          <Pagination
            href='/anime/top-anime?page'
            data={result}
            currentPage={data.pagination.current_page}
            hasNextPage={data.pagination.has_next_page}
            initialPage={`/anime/top-anime?page=1`}
            previousPage={`/anime?search=${searchParams.search}&page=${data.pagination.current_page - 1}`}
            lastPage={`/anime?search=${searchParams.search}&page=${data.pagination.last_visible_page}`}
            nextPage={`/anime?search=${searchParams.search}&page=${data.pagination.current_page + 1}`} />
        </main>
      </section>
    )
  }

  return redirect('/anime/top-anime')
}
