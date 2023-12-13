import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react"
import Link from "next/link"

import { CardHome } from "@/components/card-home"
import { api } from "@/config/api"

interface Params {
  params: {}
  searchParams: {
    search?: string
    page?: string
  }
}

export default async function IndexPage({ searchParams }: Params) {
  if (searchParams.search) {
    const correctPage = Number(searchParams.page) === 0 ? 1 : Number(searchParams.page)

    const havePage = Number(searchParams.page) ? `&page=${correctPage}` : ""
    const { data } = await api.get(
      `/anime?q=${searchParams.search}${havePage}&sfw=true`
    )

    const pages = Array.from(
      { length: data.pagination.last_visible_page },
      (_, i) => i + 1
    )
    const perPage = 10

    const results = pages.reduce((acc, _, index, array) => {
      if (index % perPage === 0) {
        acc.push(array.slice(index, index + perPage))
      }
      return acc
    }, [] as number[][])

    console.log(results)

    const actualpage = results.findIndex((page) =>
      page.includes(Number(correctPage))
    )

    const result = pages.length > perPage ? results[actualpage] : results[0]

    return (
      <section className="mx-auto mt-20 flex w-full max-w-screen-lg flex-col-reverse items-start gap-6 rounded-t-lg border-x border-t bg-background pb-16 sm:flex-row sm:pb-0">
        <main className="flex-1">
          {data?.data?.map((item: any, index: number) => (
            <CardHome
              {...item}
              index={25 * (Number(correctPage) > 0 ? Number(correctPage) - 1 : 0) + index + 1}
              key={item.mal_id}
            />
          ))}
          <div className="flex justify-center gap-2 p-4">
            <button
              className="disabled:cursor-not-allowed disabled:opacity-50"
              disabled={data.pagination.current_page === 1}
            >
              <Link
                className="flex h-8 w-8 items-center justify-center rounded-sm border hover:bg-border"
                href={`/anime?search=${searchParams.search}&page=1`}
              >
                <ChevronsLeft size={12} />
              </Link>
            </button>
            <button
              className="disabled:cursor-not-allowed disabled:opacity-50"
              disabled={data.pagination.current_page === 1}
            >
              <Link
                className="flex h-8 w-8 items-center justify-center rounded-sm border hover:bg-border"
                href={`/anime?search=${searchParams.search}&page=${data.pagination.current_page - 1
                  }`}
              >
                <ChevronLeft size={12} />
              </Link>
            </button>
            {result?.map((page: number) => (
              <Link
                key={page}
                href={`/anime?search=${searchParams.search}&page=${page}`}
              >
                <button
                  className={`${data.pagination.current_page === page ? "bg-border" : ""
                    } flex h-8 w-8 items-center justify-center rounded-sm border hover:bg-border`}
                >
                  <p className="text-xs">{page}</p>
                </button>
              </Link>
            ))}
            <button
              className="disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!data.pagination.has_next_page}
            >
              <Link
                className="flex h-8 w-8 items-center justify-center rounded-sm border hover:bg-border"
                href={`/anime?search=${searchParams.search}&page=${data.pagination.current_page + 1
                  }`}
              >
                <ChevronRight size={12} />
              </Link>
            </button>
            <button
              className="disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!data.pagination.has_next_page}
            >
              <Link
                className="flex h-8 w-8 items-center justify-center rounded-sm border hover:bg-border"
                href={`/anime?search=${searchParams.search}&page=${data.pagination.last_visible_page}`}
              >
                <ChevronsRight size={12} />
              </Link>
            </button>
          </div>
        </main>
      </section>
    )
  }
}
