import { getManga, getTopManga } from "@/config/services/top"
import { PAGES_LENGTH } from "@/lib/constants"
import { formatterSessionUpcoming, getCurrentPage, paginate } from "@/lib/utils"
import { Footer } from "@/components/ui/footer"
import { Pagination } from "@/components/ui/pagination"
import { CardHome } from "@/components/card-home"

interface Params {
  searchParams: {
    search?: string
    page?: string
  }
}

export default async function IndexPage({ searchParams }: Params) {
  const currentPage = getCurrentPage(searchParams.page)
  const { data, pagination } = await getTopManga({
    page: currentPage,
  })

  const result = paginate(
    pagination.last_visible_page,
    currentPage,
    PAGES_LENGTH
  )

  return (
    <>
      <section className="mx-auto mt-20 flex w-full max-w-screen-lg flex-col-reverse items-start gap-6 rounded-lg border bg-background pb-16 sm:flex-row sm:pb-0">
        <main className="flex-1">
          {data?.map((item, index: number) => (
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
        </main>
      </section>
      <Footer />
    </>
  )
}
