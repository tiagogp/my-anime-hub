"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export function CatalogNav({ type }: { type: "anime" | "manga" }) {
  const pathname = usePathname()
  const links =
    type === "anime"
      ? [
          ["/anime", "Browse"],
          ["/anime/top-anime", "Top Anime"],
          ["/anime/top-airing", "Now Airing"],
          ["/anime/top-upcoming", "Upcoming"],
        ]
      : [
          ["/manga", "Browse"],
          ["/manga/top-manga", "Top Manga"],
        ]

  return (
    <nav
      aria-label={`${type} catalog`}
      className="mb-8 flex flex-wrap gap-x-6 gap-y-2 border-b border-border"
    >
      {links.map(([href, title]) => (
        <Link
          key={href}
          href={href}
          aria-current={pathname === href ? "page" : undefined}
          className={cn(
            "border-b-2 border-transparent py-3 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground",
            pathname === href && "border-foreground text-foreground"
          )}
        >
          {title}
        </Link>
      ))}
    </nav>
  )
}
