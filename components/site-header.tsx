"use client"

import { siteConfig } from "@/config/site"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { Input } from './ui/input'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'

interface SiteHeaderFormProps {
  search: string
}

export function SiteHeader() {
  const { register, handleSubmit } = useForm<SiteHeaderFormProps>()
  const { push } = useRouter()

  const goToSearch = (data: SiteHeaderFormProps) => {
    const { search } = data
    console.log(data)
    if (search) {
      push(`/anime/${search}`)
    }
  }


  return (
    <header className="sticky top-0 z-40 flex w-full items-center justify-center border-b bg-background ">
      <div className="flex h-16 w-full max-w-screen-xl items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center gap-4">
            <form onSubmit={handleSubmit(goToSearch)}>
              <Input {...register('search')} className='h-8' placeholder="Search..." />
            </form>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
