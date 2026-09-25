import { FC } from "react"
import Link from "next/link"

import type { ReviewEntry } from "@/config/services/types"

import { CategoryLabel } from "../ui/category-label"

interface ReviewsListProps {
  reviews: ReviewEntry[]
}

export const ReviewsList: FC<ReviewsListProps> = ({ reviews }) => {
  if (!reviews?.length) return null

  return (
    <div className="flex w-full flex-col gap-8">
      {reviews.slice(0, 3).map((review) => (
        <article key={review.mal_id} className="flex flex-col gap-2 border-t border-border pt-6">
          <div className="flex items-center justify-between gap-4">
            <CategoryLabel>
              {review.user.username}
              {review.is_preliminary ? " · preliminary" : ""}
            </CategoryLabel>
            <span className="font-mono text-xs text-muted-foreground">
              Score {review.score}/10
            </span>
          </div>
          <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
            {review.review.length > 420
              ? `${review.review.slice(0, 420).trim()}…`
              : review.review}
          </p>
          <Link
            href={review.url}
            target="_blank"
            className="w-fit font-mono text-xs uppercase tracking-[0.04em] text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
          >
            Read full review
          </Link>
        </article>
      ))}
    </div>
  )
}
