import { FC } from "react"
import Link from "next/link"

import type { RecommendationEntry } from "@/config/services/types"

import { Image } from "../custom-image"
import { CategoryLabel } from "../ui/category-label"
import { GalleryGrid } from "../ui/gallery-grid"

interface RecommendationsGridProps {
  recommendations: RecommendationEntry[]
  link: string
}

export const RecommendationsGrid: FC<RecommendationsGridProps> = ({
  recommendations,
  link,
}) => {
  if (!recommendations?.length) return null

  return (
    <GalleryGrid className="xl:grid-cols-4">
      {recommendations.slice(0, 4).map(({ entry, votes }) => (
        <Link
          key={entry.mal_id}
          href={`${link}/${entry.route_id ?? entry.mal_id}`}
          className="group flex flex-col border border-border transition-[filter,transform] duration-200 ease-out hover:brightness-110 motion-safe:hover:-translate-y-1"
        >
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-card">
            <Image
              src={entry.images.jpg.image_url}
              alt={entry.title}
              width={220}
              height={293}
              className="absolute inset-0 size-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-1.5 border-t border-border p-3">
            <CategoryLabel>{votes} votes</CategoryLabel>
            <h3 className="line-clamp-2 font-display text-base leading-tight text-foreground">
              {entry.title}
            </h3>
          </div>
        </Link>
      ))}
    </GalleryGrid>
  )
}
