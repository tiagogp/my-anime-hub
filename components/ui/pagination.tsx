"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, ChevronsLeft } from "lucide-react"

import { cn } from "@/lib/utils"

interface PaginationProps {
  currentPage: number
  hasNextPage: boolean
  data: number[]
  initialPage: string
  previousPage: string
  nextPage: string
  lastPage: string
  href: string
  search?: string
}

export const Pagination = ({
  currentPage,
  hasNextPage,
  data,
  initialPage,
  previousPage,
  nextPage,
  href,
  search,
}: PaginationProps) => {
  const { push } = useRouter()

  const searchValue = search ? `&search=${encodeURIComponent(search)}` : ""

  const controlClass =
    "flex size-11 items-center justify-center border border-border font-mono text-xs text-foreground transition-colors duration-200 ease-out hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-foreground"

  return (
    <nav
      aria-label="Pagination"
      className="flex w-full flex-wrap justify-center gap-2 py-12"
    >
      <button
        aria-label="First page"
        name="initial-page"
        onClick={() => push(initialPage)}
        className={controlClass}
        disabled={currentPage === 1 || currentPage === 0}
      >
        <ChevronsLeft size={13} />
      </button>
      <button
        aria-label="Previous page"
        name="previous-page"
        onClick={() => push(previousPage)}
        className={controlClass}
        disabled={currentPage === 1 || currentPage === 0}
      >
        <ChevronLeft size={13} />
      </button>
      {data?.map((page: number) => (
        <Link
          key={page}
          href={`${href}${page}${searchValue}`}
          aria-label={`Page ${page}`}
          aria-current={currentPage === page ? "page" : undefined}
          className={cn(
            controlClass,
            currentPage === page && "bg-foreground text-background"
          )}
        >
          {page}
        </Link>
      ))}
      <button
        aria-label="Next page"
        name="next-page"
        onClick={() => push(nextPage)}
        className={controlClass}
        disabled={!hasNextPage}
      >
        <ChevronRight size={13} />
      </button>
    </nav>
  )
}
