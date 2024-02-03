import Link from "next/link"

import { getAnimeById } from '@/config/services/anime'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Video } from '@/components/ui/video'

interface Params {
  params: {
    id?: string
  }
}



export default async function IndexPage({ params }: Params) {

  if (params.id) {
    const { data } = await getAnimeById(params.id);

    return (
      <section className="mx-auto mt-20 flex w-full max-w-screen-lg flex-col items-start gap-4 rounded-t-lg border bg-background p-4 pb-20 sm:pb-4">
        <main className="flex w-full flex-col gap-2 sm:flex-row sm:gap-6">

          <div className="flex flex-col gap-2 rounded-lg sm:w-56 ">
            <Image
              src={data.images.webp.large_image_url}
              alt={data.title}
              width={224}
              height={300}
              className="aspect-auto w-full rounded sm:w-56"
            />
            <div className='hidden flex-col gap-2 sm:flex'>
              <h1 className='w-48 font-bold text-foreground/70'>Genres</h1>
              <div className='flex flex-wrap gap-1'>
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

          <div className='flex flex-1 flex-col items-start gap-x-4 gap-y-2 '>
            <div className='flex w-full flex-col gap-4 sm:flex-row'>
              <div className='flex w-full flex-col items-start justify-between gap-2 '>
                <div>
                  <h1 className="text-xl font-bold">{data.title}</h1>
                  <h1 className="text-md font-bold text-foreground/70">{data.title_english}</h1>
                </div>

                <div className='flex items-center gap-2 '>
                  <p className='text-sm text-foreground/70'>{
                    data.studios.length > 0 ? "Studio" : "Studios"
                  }</p>
                  <div className='flex flex-wrap gap-2'>
                    {
                      data.studios.map((studio: any) => (
                        <Link target="_blank" className='rounded bg-foreground/10 px-2 py-1 text-xs font-semibold text-foreground/60' key={studio.mal_id} href={studio.url}>
                          <p key={studio.mal_id}>{studio.name}</p>
                        </Link>
                      ))
                    }
                  </div>
                </div>

                <div className='flex flex-col gap-2 sm:hidden'>
                  <h3 className='w-48 font-bold text-foreground/70'>Genres</h3>
                  <div className='flex flex-wrap gap-1'>
                    {data.genres.map((genre: any) => {
                      return (
                        <Link
                          href={`/genre/${genre.name}`}
                          key={genre.mal_id}
                          className="rounded-sm bg-foreground/10 px-1.5 py-0.5 text-xs font-bold text-foreground/70"
                        >
                          {genre.name}
                        </Link>
                      )
                    })}
                  </div>
                </div>

                <div className='flex w-full max-w-md items-center justify-between overflow-hidden rounded border'>
                  <div className='flex flex-col items-center justify-center bg-foreground/10 px-4 py-2'>
                    <p className="rounded-sm bg-primary/90 px-2 text-sm font-semibold text-white">Score</p>
                    <p className="text-2xl font-bold text-foreground/80"> {data.score}</p>
                  </div>

                  <div className='flex max-w-sm flex-1 items-center justify-between px-4 text-foreground/70'>
                    <div className='flex flex-col items-center '>
                      <p className='text-sm sm:text-base'>Ranked</p>
                      <p className="text-sm font-bold sm:text-base">#{data.rank}</p>
                    </div>
                    <div className='flex flex-col items-center '>
                      <p className='text-sm sm:text-base'>Popularity</p>
                      <p className="text-sm font-bold sm:text-base">#{data.popularity}</p>
                    </div>
                    <div className='flex flex-col items-center'>
                      <p className='text-sm sm:text-base'>Members</p>
                      <p className="text-sm font-bold sm:text-base">#{data.members.toLocaleString('en-US')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {data.trailer.youtube_id &&
                <Video
                  wrapperClass='w-full overflow-hidden rounded-md flex justify-center items-center aspect-video bg-image bg-center bg-no-repeat bg-cover outline outline-border'
                  iframeClass='size-full rounded-md outline outline-border aspect-video'
                  playerClass=''
                  id={data.trailer.youtube_id}
                  title={data.title}
                />
              }
            </div>

            <div className='w-full text-sm text-foreground/70'>
              <p className="font-semibold">Status:
                <span className="font-normal"> {data.status}</span>
              </p>
              <p className="font-semibold">Episodes:
                <span className="font-normal"> {data.episodes}</span>
              </p>

              <p className=" font-semibold">Type:
                <span className="font-normal"> {data.type}</span>
              </p>
            </div>

            <p className="text-xs text-foreground/70 ">
              {data.synopsis}
            </p>
          </div>

        </main>

      </section>
    )
  }

  return notFound()
}
