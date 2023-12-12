import { CardHome } from '@/components/card-home'
import { getSessionNow, getSessionUpcoming } from '@/config/services/seasons'

export default async function IndexPage() {
  const {
    data: seasonNow,
  } = await getSessionNow({
    limit: 5
  })

  const {
    data: seasonUpcoming,
  } = await getSessionUpcoming({
    limit: 5
  })


  return (
    <section className="mx-auto mt-20 flex w-full max-w-screen-lg flex-col-reverse items-start gap-6 rounded-t-lg border-x border-t bg-background pb-12 sm:flex-row sm:pb-0">
      <main className='flex-1'></main>
      <aside className='w-full sm:w-[300px]'>
        <div className='rounded-t-sm border sm:rounded-tl-none sm:rounded-tr-sm'>
          <header className='sticky top-24 z-10 rounded-t-sm bg-border p-6 py-2 sm:top-16 sm:rounded-tl-none sm:rounded-tr-sm'>
            <h2 className='text-center font-bold '>Top Airing Anime</h2>
          </header>

          {seasonNow.map((item, index) => (
            <CardHome
              {...item}
              index={++index}
              key={item.mal_id}
            />
          ))
          }

          <div className='flex cursor-pointer items-center justify-center border-t py-2 hover:bg-border/30'>
            <h2 className='text-sm font-bold'>
              More
            </h2>
          </div>
        </div>
        <div className='border'>
          <header className='sticky top-24 z-10 bg-border p-6  py-2  sm:top-16'>
            <h2 className='text-center font-bold'>Top Upcoming Anime</h2>
          </header>

          {
            seasonUpcoming.map((item, index) => (
              <CardHome
                {...item}
                index={++index}
                key={item.mal_id}
              />
            ))
          }
          <div className='flex cursor-pointer items-center justify-center border-t py-2 hover:bg-border/30'>
            <h2 className='text-sm font-bold'>
              More
            </h2>
          </div>
        </div>
      </aside>
    </section>
  )
}
