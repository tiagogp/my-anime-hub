import type { ReactNode } from "react"
import Link from "next/link"
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

const controlClass =
  "flex size-11 items-center justify-center border border-border font-mono text-xs text-foreground transition-colors duration-200 ease-out hover:bg-foreground hover:text-background"

function PageControl({
  disabled,
  href,
  label,
  rel,
  children,
}: {
  disabled: boolean
  href: string
  label: string
  rel?: string
  children: ReactNode
}) {
  if (disabled)
    return (
      <span
        role="link"
        aria-disabled="true"
        aria-label={label}
        className={cn(controlClass, "pointer-events-none opacity-40")}
      >
        {children}
      </span>
    )
  return (
    <Link href={href} aria-label={label} rel={rel} className={controlClass}>
      {children}
    </Link>
  )
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
  const searchValue = search ? `&search=${encodeURIComponent(search)}` : ""
  return (
    <nav
      aria-label="Pagination"
      className="flex w-full flex-wrap justify-center gap-2 py-12"
    >
      <PageControl
        href={initialPage}
        label="First page"
        disabled={currentPage <= 1}
      >
        <ChevronsLeft size={13} />
      </PageControl>
      <PageControl
        href={previousPage}
        label="Previous page"
        rel="prev"
        disabled={currentPage <= 1}
      >
        <ChevronLeft size={13} />
      </PageControl>
      {data?.map((page) => (
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
      <PageControl
        href={nextPage}
        label="Next page"
        rel="next"
        disabled={!hasNextPage}
      >
        <ChevronRight size={13} />
      </PageControl>
    </nav>
  )
}
