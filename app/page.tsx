import Link from "next/link"

import { getSessionNow, getSessionUpcoming } from "@/config/services/seasons"
import { getTopAnime } from "@/config/services/top"
import { formatterSessionUpcoming } from "@/lib/utils"
import { Footer } from "@/components/ui/footer"
import { CardHome } from "@/components/card-home"

export const revalidate = 3600

export default async function IndexPage() {
  const [seasonNow, topAnime, seasonUpcoming] = await Promise.all([
    getSessionNow({
      limit: "10",
    }),
    getTopAnime({
      limit: "25",
    }),
    getSessionUpcoming({
      limit: "15",
    }),
  ])

  const formattedSessionUpcoming = formatterSessionUpcoming(seasonUpcoming.data)

  return (
    <div className="pb-16 sm:pb-0">
      <section className="mx-auto mt-20 flex w-full max-w-screen-lg flex-col-reverse items-start gap-y-6 rounded-lg border bg-background sm:flex-row">
        <main className="w-full border-r md:flex-1">
          {topAnime.data?.map((item: any, index: number) => (
            <CardHome
              {...item}
              link={"/anime"}
              index={++index}
              key={item.mal_id}
            />
          ))}
          <Link
            href="/anime/top-anime"
            className="flex cursor-pointer items-center justify-center border-y py-2 hover:bg-border/30 sm:border-b-0"
          >
            <h2 className="text-sm font-bold">More top anime</h2>
          </Link>
        </main>
        <aside className="w-full sm:w-[300px]">
          <div className="rounded-t-sm sm:rounded-tl-none sm:rounded-tr-sm">
            <header className="sticky top-24 z-10 rounded-t-sm bg-border p-6 py-2 sm:top-16 sm:rounded-tl-none sm:rounded-tr-sm">
              <h2 className="text-center font-bold ">Top Airing Anime</h2>
            </header>

            {seasonNow.data.map((item, index) => (
              <CardHome
                {...item}
                link={"/anime"}
                index={++index}
                key={item.mal_id}
              />
            ))}

            <Link
              href="/anime/top-airing"
              className="flex cursor-pointer items-center justify-center border-t py-2 hover:bg-border/30"
            >
              <h2 className="text-sm font-bold">More top airing</h2>
            </Link>
          </div>
          <div className="">
            <header className="sticky top-24 z-10 bg-border p-6 py-2 sm:top-16">
              <h2 className="text-center font-bold">Top Upcoming Anime</h2>
            </header>

            {formattedSessionUpcoming.map((item, index) => (
              <CardHome
                {...item}
                link={"/anime"}
                index={++index}
                key={item.mal_id}
              />
            ))}

            <Link
              href="/anime/top-upcoming"
              className="flex cursor-pointer items-center justify-center border-y py-2 hover:bg-border/30"
            >
              <h2 className="text-sm font-bold">More top upcoming</h2>
            </Link>
          </div>
        </aside>
      </section>
      <Footer />
    </div>
  )
}
