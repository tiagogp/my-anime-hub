"use client"

import { useRouter, useSearchParams } from "next/navigation"

import type { GenreEntry } from "@/config/services/types"

const TYPE_OPTIONS: Record<"anime" | "manga", string[]> = {
  anime: ["TV", "Movie", "OVA", "Special", "ONA", "Music"],
  manga: ["Manga", "Novel", "Oneshot"],
}

const STATUS_OPTIONS: Record<"anime" | "manga", string[]> = {
  anime: ["airing", "complete", "upcoming"],
  manga: ["publishing", "complete", "hiatus", "discontinued", "upcoming"],
}

const ORDER_BY_OPTIONS = [
  { value: "score", label: "Score" },
  { value: "rank", label: "Rank" },
  { value: "popularity", label: "Popularity" },
  { value: "favorites", label: "Favorites" },
  { value: "title", label: "Title" },
  { value: "start_date", label: "Start date" },
]

interface FilterBarProps {
  type: "anime" | "manga"
  basePath: string
  genres: GenreEntry[]
}

const selectClass =
  "h-11 min-w-0 max-w-full border border-border bg-background px-2 font-mono text-xs uppercase tracking-[0.04em] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"

export const FilterBar = ({ type, basePath, genres }: FilterBarProps) => {
  const searchParams = useSearchParams()
  const { push } = useRouter()

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    params.delete("page")

    push(`${basePath}?${params.toString()}`)
  }

  return (
    <div className="flex w-full flex-wrap items-center gap-3 border-b border-border pb-6">
      <select
        aria-label="Filter by type"
        className={selectClass}
        value={searchParams.get("type") ?? ""}
        onChange={(e) => updateParam("type", e.target.value)}
      >
        <option value="">All types</option>
        {TYPE_OPTIONS[type].map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <select
        aria-label="Filter by status"
        className={selectClass}
        value={searchParams.get("status") ?? ""}
        onChange={(e) => updateParam("status", e.target.value)}
      >
        <option value="">All statuses</option>
        {STATUS_OPTIONS[type].map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <select
        aria-label="Filter by genre"
        className={selectClass}
        value={searchParams.get("genres") ?? ""}
        onChange={(e) => updateParam("genres", e.target.value)}
      >
        <option value="">All genres</option>
        {genres.map((genre) => (
          <option key={genre.mal_id} value={genre.name}>
            {genre.name}
          </option>
        ))}
      </select>

      <select
        aria-label="Sort by"
        className={selectClass}
        value={searchParams.get("order_by") ?? ""}
        onChange={(e) => {
          const params = new URLSearchParams(searchParams.toString())

          if (e.target.value) {
            params.set("order_by", e.target.value)
            params.set("sort", e.target.value === "title" ? "asc" : "desc")
          } else {
            params.delete("order_by")
            params.delete("sort")
          }

          params.delete("page")

          push(`${basePath}?${params.toString()}`)
        }}
      >
        <option value="">Default order</option>
        {ORDER_BY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            Sort by {option.label}
          </option>
        ))}
      </select>
      {["type", "status", "genres", "order_by"].some((key) =>
        searchParams.has(key)
      ) && (
        <button
          type="button"
          className="min-h-11 font-mono text-xs underline underline-offset-4"
          onClick={() => {
            const params = new URLSearchParams()
            const search = searchParams.get("search")
            if (search) params.set("search", search)
            push(`${basePath}${params.size ? `?${params}` : ""}`)
          }}
        >
          Clear filters
        </button>
      )}
    </div>
  )
}
