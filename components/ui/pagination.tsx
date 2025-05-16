"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

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
  lastPage,
  href,
  search,
}: PaginationProps) => {
  const { push } = useRouter()

  const searchValue = search ? `&search=${search}` : ""

  return (
    <div className="flex flex-wrap justify-center gap-2 p-4">
      <button
        name="initial-page"
        onClick={() => push(initialPage)}
        className="flex size-8 items-center justify-center rounded-sm border hover:bg-border disabled:cursor-not-allowed disabled:opacity-50"
        disabled={currentPage === 1 || currentPage === 0}
      >
        <ChevronsLeft size={12} />
      </button>
      <button
        name="previous-page"
        onClick={() => push(previousPage)}
        className="flex size-8  items-center justify-center rounded-sm border hover:bg-border disabled:cursor-not-allowed disabled:opacity-50"
        disabled={currentPage === 1 || currentPage === 0}
      >
        <ChevronLeft size={12} />
      </button>
      {data?.map((page: number) => (
        <Link key={page} href={`${href}${page}${searchValue}`}>
          <button
            name={`page-${page}`}
            className={`${
              currentPage === page ? "bg-border" : ""
            } flex size-8 items-center justify-center rounded-sm border hover:bg-border`}
          >
            <p className="text-xs">{page}</p>
          </button>
        </Link>
      ))}
      <button
        name="next-page"
        onClick={() => push(nextPage)}
        className="flex size-8 items-center justify-center rounded-sm border hover:bg-border disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!hasNextPage}
      >
        <ChevronRight size={12} />
      </button>
      <button
        name="last-page"
        onClick={() => push(lastPage)}
        className="flex size-8 items-center justify-center rounded-sm border hover:bg-border disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!hasNextPage}
      >
        <ChevronsRight size={12} />
      </button>
    </div>
  )
}
