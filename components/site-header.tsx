"use client"

import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { siteConfig } from "@/config/site"
import { cn, getActiveNavItemIndex } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Input } from './ui/input'

import { useMediaQuery } from '@/lib/hooks/use-media-query'
import { useSearch } from '@/lib/hooks/use-search'


export function SiteHeader() {
  const { delayFocusSearch, focusSearch, isLoading, register, searchResult, setFocusSearch, setSearch, search } = useSearch()

  const matches = useMediaQuery('(max-width: 480px)')

  const pathname = usePathname()
  const { push } = useRouter()

  const currentPath = pathname as string

  const correctedPath = currentPath.split('/').length > 1 ? currentPath.split('/').filter(item => item !== '')[0] : currentPath

  return (
    <>
      <header className={`sticky top-0 z-40 flex w-full items-center justify-center border-b bg-background dark:bg-background/95`}>
        <div className="flex h-24 w-full max-w-screen-lg flex-col items-center justify-center gap-1 sm:h-16 sm:flex-row sm:justify-between sm:gap-4">
          <MainNav />

          <div className='flex w-full items-center justify-center'>
            {siteConfig.mainNav?.length ? (
              <nav className=" hidden gap-6 sm:flex">
                {siteConfig.mainNav?.map(
                  ({ href, title, disabled }, index) =>
                    href && (
                      <Link
                        key={index}
                        href={href}
                        className={cn(
                          "flex items-center rounded-sm border border-transparent px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-border active:scale-95",
                          disabled && "cursor-not-allowed opacity-80",
                          getActiveNavItemIndex(siteConfig.mainNav, correctedPath, pathname) === index && "bg-border"
                        )}
                      >
                        {title}
                      </Link>
                    )
                )}
              </nav>
            ) : null}
          </div>
          <div className="relative flex w-10/12 items-center justify-center space-x-4 sm:justify-end ">
            <nav className="flex w-full items-center gap-4 sm:justify-between">
              <div className='w-full max-w-xs'>
                <div className='relative flex items-center'>
                  <Input
                    {...register('search')}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => setFocusSearch(true)} onBlur={() => searchResult && setTimeout(() => {
                      setFocusSearch(false)
                    }, 150)} className='h-8 rounded-full pr-7' placeholder="Search..."
                  />
                  {isLoading &&
                    <motion.div
                      className='absolute right-0 mr-2'
                      initial={{ opacity: 0, translateX: 10 }}
                      animate={{ opacity: 1, translateX: 0 }}
                    >
                      <Loader2 className='size-4 animate-spin text-primary' />
                    </motion.div>
                  }
                </div>
                {(searchResult?.data?.length > 0 && focusSearch || delayFocusSearch) &&
                  <motion.div
                    initial={{ maxHeight: 0 }}
                    animate={{ maxHeight: focusSearch ? 'calc(100vh - 12rem)' : 0, }}
                    className='absolute top-12 z-20 flex  w-full flex-col gap-2 overflow-y-auto rounded-b-sm border-x border-b bg-background px-4 sm:right-0 sm:top-12 sm:w-96'>
                    {
                      searchResult?.data?.length > 0 && searchResult?.data.map((item) => (
                        <div key={item.mal_id}
                          onClick={() => push(`/anime/${item.mal_id}`)}
                          className='group flex w-full cursor-pointer justify-between gap-2 rounded-sm first-of-type:mt-4 last-of-type:mb-4 hover:bg-border/30' >
                          <Image
                            src={item.images.jpg.image_url}
                            alt={item.title}
                            width={64}
                            height={64}
                            className='size-14 rounded-sm object-cover transition-all duration-300 group-hover:h-20'
                          />
                          <div className='flex-1'>
                            <h2 className='text-xs font-bold transition-all duration-300 group-hover:text-sm'>{item.title}</h2>
                            <p className='hidden text-xs opacity-0 transition-all duration-300 group-hover:block group-hover:opacity-50'>{item.type}, {item.episodes} eps, scored {item.score}</p>
                            <p className='text-xs opacity-50'>({item.type}, {item.year ?? new Date(item.aired.from).getFullYear() ?? item.aired.prop.from.year})</p>
                            <p className='hidden  text-xs opacity-0 group-hover:block group-hover:opacity-50'>{item.status}</p>
                            <p className='text-xs opacity-50'>{item.genres.flatMap((genre) => genre.name).join(', ')}</p>
                          </div>
                        </div>
                      ))
                    }
                    {searchResult.haveMore && <button
                      onClick={() => {
                        push(`/anime?search=${search}`)
                      }}
                      className='sticky bottom-0 w-full border-t bg-background p-2 text-xs font-medium text-foreground hover:bg-muted active:scale-95'
                    >
                      Load more
                    </button>
                    }
                  </motion.div>}
                {matches && (searchResult?.data?.length > 0 && focusSearch || delayFocusSearch) &&
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: focusSearch ? 1 : 0 }}
                    onClick={() => setFocusSearch(false)}
                    className='fixed inset-x-0 top-24 z-10 h-screen w-full bg-foreground/5 backdrop-blur-sm'
                  />}
              </div>
              <ThemeToggle />
            </nav>
          </div>
        </div>
      </header>

      <footer className="fixed bottom-0 z-20 w-full border-t border-border bg-background sm:hidden">
        <div className="mx-auto flex max-w-screen-lg items-center justify-around gap-1 px-4 py-2">
          {siteConfig.mainNav?.map(
            ({ href, icon, title, alternativePath, disabled }, index) =>
              href && (
                <Link
                  key={index}
                  href={href}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-1 rounded-sm border border-transparent px-3 py-1 text-xs font-medium text-foreground transition-all hover:border-border active:scale-95",
                    disabled && "cursor-not-allowed opacity-80",
                    getActiveNavItemIndex(siteConfig.mainNav, correctedPath, pathname) === index && "bg-border"
                  )}
                >
                  {icon}
                  {title}
                </Link>
              )
          )}
        </div>
      </footer>
    </>
  )
}
