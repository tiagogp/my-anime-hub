import { CardHome } from '@/components/card-home'
import { getTopManga } from '@/config/services/top'
import Link from 'next/link'

export const revalidate = 3600 // revalidate the data at most every hour

export default async function IndexPage() {
  const topManga = await getTopManga({
    limit: '25'
  })


  return (
    <div className='pb-16'>
      <section className="mx-auto mt-20 flex w-full max-w-screen-lg flex-col-reverse items-start gap-y-6 rounded-lg border bg-background  sm:flex-row">
        <main className='flex-1 '>
          {topManga.data?.map((item: any, index: number) => (
            <CardHome
              {...item}
              link={'/manga'}
              index={++index}
              key={item.mal_id}
              className='group transition-all even:bg-border/40 hover:bg-border/50 even:hover:bg-border/70'
            />
          ))}
          <Link href='/anime/top-anime' className='flex cursor-pointer items-center justify-center border-y py-2 hover:bg-border/30 sm:border-b-0'>
            <h2 className='text-sm font-bold'>
              More top mangas
            </h2>
          </Link>
        </main>

      </section>
      <div className='flex items-center justify-center py-4'>
        <main className='w-full max-w-screen-lg'>
          <span className='mx-2 text-sm opacity-70'>Built by{' '}
            <Link href={'https://github.com/tiagogp-exe'}
              className='underline hover:text-foreground/70'
            >
              Tiago Guimarães
            </Link>. The source code is available on{' '}
            <Link href={'https://github.com/tiagogp-exe/doc'}
              className='underline hover:text-foreground/70'
            >
              GitHub
            </Link>
            .</span>
        </main>
      </div>
    </div>
  )
}
