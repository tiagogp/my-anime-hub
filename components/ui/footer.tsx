import Link from 'next/link'

export const Footer = () => (
  <div className='flex items-center justify-center py-4'>
    <main className='w-full max-w-screen-lg text-center md:text-start'>
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
)