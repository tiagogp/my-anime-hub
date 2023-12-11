import Image from 'next/image'

const getAnimes = async () => {
  const data = await fetch('http://localhost:3000/api/anime')

  const animes = await data.json()

  return animes
}


export default async function IndexPage() {

  const { contentVideos } = await getAnimes()

  const correctTitle = (title: string) => {

    const haveDubbed = title.includes('Dublado')

    const haveEp = title.includes('ep')

    if (haveDubbed) {
      return title.split('- Dublado')[0].trim()
    }

    if (haveEp) {
      return title.split('ep')[0].trim()
    }

    return title.replace(/_/g, ' ')
  }

  return (
    <section className="container mx-auto flex w-full max-w-screen-xl flex-col items-center gap-6 pb-8 pt-6">
      <h1 className='w-full text-left text-3xl font-bold'>Lançamentos</h1>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4'>
        {contentVideos.map((video: any) => (
          <div key={video.slug}
            className='group flex cursor-pointer flex-col gap-2 rounded-md border'
          >
            <div className='relative h-36 overflow-hidden rounded-t-sm'>
              <Image
                src={video.image}
                alt={video.title}
                width={200}
                height={200}
                className='w-full  transition-all duration-300 group-hover:scale-125'
              />
            </div>
            <div className='flex flex-col gap-2 px-4 pb-4 pt-2'>
              <div className='flex items-center justify-between'>
                <h3 className='font-bold'>Episódio {video.episode}</h3>

                <p className='text-xs opacity-50'> {
                  new Date(video.createdAt).toLocaleDateString('pt-BR', {
                    day: 'numeric',
                    month: '2-digit',
                    year: 'numeric',
                  })
                }</p>
              </div>
              <p className='truncate text-xs'>{correctTitle(video.title)}</p>

            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
