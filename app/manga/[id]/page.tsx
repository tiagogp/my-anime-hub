import { Metadata, ResolvingMetadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"

import { getMangaById } from "@/config/services/manga"
import { Footer } from "@/components/ui/footer"
import { SectionAnimated } from "@/components/ui/section-animated"
import BackgroundImage from "@/components/background-image"

interface Params {
  params: {
    id?: string
  }
}

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { data } = await getMangaById(params.id)

  const previousImages = (await parent).openGraph?.images || []

  return {
    title: data.title,
    openGraph: {
      images: [data.images.webp.image_url, ...previousImages],
      tags: data.genres,
    },
    description: data.synopsis,
  }
}

export default async function IndexPage({ params }: Params) {
  if (params.id) {
    const { data } = await getMangaById(params.id)

    const correctTitle =
      data.title_english?.toLowerCase() === data.title?.toLowerCase()
        ? data.title_japanese.toLowerCase() === data.title.toLowerCase()
          ? null
          : data.title_japanese
        : data.title_english

    return (
      <>
        {data.images.webp.large_image_url && (
          <BackgroundImage
            alt={data.title}
            src={data.images.webp.large_image_url}
          />
        )}

        <SectionAnimated className="relative z-20  mx-auto mt-20 flex w-full max-w-screen-lg flex-col items-start gap-4 rounded-t-lg border bg-background/80 p-4 pb-20 backdrop-blur-lg sm:pb-4">
          <main className="flex w-full flex-col gap-2 sm:flex-row sm:gap-6">
            <div className="flex flex-1 flex-col gap-2 rounded-lg sm:w-56">
              <Image
                src={data.images.webp.large_image_url}
                alt={data.title}
                width={224}
                height={300}
                className="aspect-auto w-full rounded bg-background/80 object-cover sm:w-56"
                priority
              />

              <div className="hidden flex-col gap-2 sm:flex">
                <h1 className="w-48 font-bold text-foreground/70">Genres</h1>
                <div className="flex flex-wrap gap-1">
                  {data.genres.map((genre: any) => {
                    return (
                      <button
                        key={genre.mal_id}
                        className="rounded-sm bg-foreground/10 px-1.5 py-0.5 text-xs font-bold text-foreground/70"
                      >
                        {genre.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="flex flex-[3.5] flex-col items-start gap-x-4 gap-y-2 ">
              <div className="flex w-full flex-col gap-4 sm:flex-row">
                <div className="flex w-full flex-col items-start justify-between gap-2 ">
                  <div className="relative w-full">
                    <h1 className="text-xl font-bold">{data.title}</h1>
                    <h1 className="text-md font-bold text-foreground/70">
                      {correctTitle}
                    </h1>
                  </div>
                  <div className="flex flex-col gap-2 sm:hidden">
                    <h1 className="w-48 font-bold text-foreground/70">
                      Genres
                    </h1>
                    <div className="flex flex-wrap gap-1">
                      {data.genres.map((genre: any) => {
                        return (
                          <div
                            key={genre.mal_id}
                            className="rounded-sm bg-foreground/10 px-1.5 py-0.5 text-xs font-bold text-foreground/70"
                          >
                            {genre.name}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="flex w-full max-w-md items-center justify-between overflow-hidden rounded border">
                    <div className="flex flex-col items-center justify-center bg-foreground/10 px-4 py-2">
                      <p className="rounded-sm bg-primary/90 px-2 text-sm font-semibold text-white">
                        Score
                      </p>
                      <p className="text-xl font-bold text-foreground/80">
                        {" "}
                        {data.score ? data.score : "N/A"}
                      </p>
                    </div>

                    <div className="flex max-w-sm flex-1 items-center justify-between px-4 text-foreground/70">
                      <div className="flex flex-col items-center ">
                        <p className="text-sm sm:text-base">Ranked</p>
                        <p className="text-sm font-bold sm:text-base">
                          #{data?.rank ? data.rank : "N/A"}
                        </p>
                      </div>
                      <div className="flex flex-col items-center ">
                        <p className="text-sm sm:text-base">Popularity</p>
                        <p className="text-sm font-bold sm:text-base">
                          #{data.popularity}
                        </p>
                      </div>
                      <div className="flex flex-col items-center">
                        <p className="text-sm sm:text-base">Members</p>
                        <p className="text-sm font-bold sm:text-base">
                          #{data.members.toLocaleString("en-US")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full text-sm text-foreground/70">
                <p className="font-semibold">
                  Status:
                  <span className="font-normal"> {data.status}</span>
                </p>
                <p className="font-semibold">
                  Episodes:
                  <span className="font-normal"> {data.chapters}</span>
                </p>
                <p className="font-semibold">
                  Volumes:
                  <span className="font-normal">{data.volumes}</span>
                </p>

                <p className=" font-semibold">
                  Type:
                  <span className="font-normal"> {data.type}</span>
                </p>
              </div>

              <p className="text-xs text-foreground/70 ">{data.synopsis}</p>
            </div>
          </main>
          <Footer />
        </SectionAnimated>
      </>
    )
  }

  return notFound()
}
