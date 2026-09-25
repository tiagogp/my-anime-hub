"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

import type { Genre } from "@/config/services/types"
import { siteConfig } from "@/config/site"
import { useSearch } from "@/lib/hooks/use-search"
import { cn, getActiveNavItemIndex } from "@/lib/utils"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"

import { Image } from "./custom-image"
import { Input } from "./ui/input"

export function SiteHeader() {
  const {
    focusSearch,
    isLoading,
    register,
    searchResult,
    setFocusSearch,
    setSearch,
    search,
    inputRef,
  } = useSearch()

  const pathname = usePathname()

  const isManga = pathname.includes("manga")

  const correctInitialPathname = isManga ? `/manga` : `/anime`

  const searchUrl = `${correctInitialPathname}?search=${encodeURIComponent(
    search?.trim() ?? ""
  )}`

  const currentPath = pathname as string

  const correctedPath =
    currentPath.split("/").length > 1
      ? currentPath.split("/").filter((item) => item !== "")[0]
      : currentPath

  const activeIndex = getActiveNavItemIndex(
    siteConfig.mainNav,
    correctedPath,
    pathname
  )

  return (
    <>
      <header className="sticky top-0 z-40 flex w-full items-center justify-center border-b border-border bg-background">
        <div className="flex h-28 w-full max-w-content flex-col items-center justify-center gap-3 px-4 sm:h-16 sm:flex-row sm:justify-between sm:gap-4 sm:px-6">
          <MainNav />

          {siteConfig.mainNav?.length ? (
            <nav
              aria-label="Main navigation"
              className="hidden gap-4 sm:flex lg:gap-8"
            >
              {siteConfig.mainNav?.map(
                ({ href, title, disabled }, index) =>
                  href && (
                    <Link
                      key={index}
                      href={href}
                      aria-current={activeIndex === index ? "page" : undefined}
                      className={cn(
                        "relative flex items-center gap-2 py-2 font-mono text-[0.8125rem] tracking-[0.02em] text-muted-foreground transition-colors hover:text-foreground",
                        disabled && "cursor-not-allowed opacity-50",
                        activeIndex === index && "text-foreground"
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "size-1 rounded-full bg-transparent transition-colors",
                          activeIndex === index && "bg-accent-warm-amber"
                        )}
                      />
                      {title}
                    </Link>
                  )
              )}
            </nav>
          ) : null}

          <div className="relative flex w-full items-center gap-4 sm:w-auto">
            <form
              role="search"
              action={correctInitialPathname}
              className="w-full sm:w-48 lg:w-56"
              onSubmit={(event) => {
                if (!search?.trim()) event.preventDefault()
                setFocusSearch(false)
              }}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget))
                  setFocusSearch(false)
              }}
            >
              <div className="relative flex items-center">
                <Input
                  {...register("search")}
                  value={search ?? ""}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setFocusSearch(true)}
                  ref={inputRef}
                  autoComplete="off"
                  aria-label={isManga ? "Search manga" : "Search anime"}
                  className="h-9 pr-7"
                  placeholder="Search…"
                />
                {isLoading && (
                  <motion.div
                    className="absolute right-0 mr-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                  </motion.div>
                )}
              </div>
              {focusSearch && search?.trim() && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute top-11 z-20 flex max-h-[60vh] w-full flex-col overflow-y-auto border border-t-0 border-border bg-background sm:right-0 sm:top-11 sm:w-96"
                >
                  {searchResult?.data?.length > 0 &&
                    searchResult?.data.map((item) => (
                      <Link
                        key={item.mal_id}
                        href={`${correctInitialPathname}/${
                          item.route_id ?? item.mal_id
                        }`}
                        onClick={() => setFocusSearch(false)}
                        className="group flex w-full cursor-pointer gap-3 border-b border-border p-3 last-of-type:border-b-0 hover:bg-card"
                      >
                        <Image
                          src={item.images.jpg.image_url}
                          alt={item.title}
                          width={56}
                          height={56}
                          className="size-14 shrink-0 object-cover"
                        />
                        <div className="flex-1 overflow-hidden">
                          <h2 className="truncate font-display text-sm text-foreground">
                            {item.title}
                          </h2>
                          {!isManga ? (
                            <p className="text-xs text-muted-foreground">
                              {[
                                item.type,
                                item.year || item.aired?.prop?.from?.year,
                              ]
                                .filter(Boolean)
                                .join(" · ")}
                            </p>
                          ) : null}
                          <p className="truncate text-xs text-muted-foreground">
                            {item.genres
                              .flatMap((genre: Genre) => genre.name)
                              .join(", ")}
                          </p>
                        </div>
                      </Link>
                    ))}
                  {!isLoading && !searchResult?.data?.length && (
                    <p
                      role="status"
                      className="p-3 text-sm text-muted-foreground"
                    >
                      No suggestions found. Press Enter to search the catalog.
                    </p>
                  )}
                  {isLoading && (
                    <p
                      role="status"
                      className="p-3 text-sm text-muted-foreground"
                    >
                      Searching…
                    </p>
                  )}
                  <Link
                    href={searchUrl}
                    onClick={() => setFocusSearch(false)}
                    className="sticky bottom-0 w-full border-t border-border bg-background p-3 font-mono text-xs uppercase tracking-[0.04em] text-foreground hover:bg-card"
                  >
                    View all results →
                  </Link>
                </motion.div>
              )}
            </form>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <nav
        aria-label="Mobile navigation"
        className="fixed bottom-0 z-30 w-full border-t border-border bg-background pb-[env(safe-area-inset-bottom)] sm:hidden"
      >
        <div className="mx-auto flex max-w-content items-center justify-around gap-1 px-4 py-2">
          {siteConfig.mainNav?.map(
            ({ href, icon, title, disabled }, index) =>
              href && (
                <Link
                  key={index}
                  href={href}
                  aria-current={activeIndex === index ? "page" : undefined}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-1 border border-transparent px-3 py-1 font-mono text-[0.6875rem] text-muted-foreground transition-colors",
                    disabled && "cursor-not-allowed opacity-50",
                    activeIndex === index && "text-foreground"
                  )}
                >
                  {icon}
                  {title}
                </Link>
              )
          )}
        </div>
      </nav>
    </>
  )
}
