import { CardHome } from '@/components/card-home'
import { api } from '@/config/api';

interface Params {
  params: {};
  searchParams: {
    search?: string
  }
}

export default async function IndexPage({ searchParams }: Params) {

  if (searchParams.search) {
    const { data } = await api.get(`/anime?q=${searchParams.search}`)


    return (
      <section className="mx-auto mt-20 flex w-full max-w-screen-lg flex-col-reverse items-start gap-6 rounded-t-lg border-x border-t bg-background pb-12 sm:flex-row sm:pb-0">
        <main className='flex-1'>
          {
            data.data.map((item: any, index: number) => (
              <CardHome
                {...item}
                index={++index}
                key={item.mal_id}
              />
            ))
          }
        </main>
      </section>
    )
  }
}
