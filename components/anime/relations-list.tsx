import { FC } from "react"
import Link from "next/link"

import type { Relation } from "@/config/services/types"

import { CategoryLabel } from "../ui/category-label"

interface RelationsListProps {
  relations: Relation[]
}

export const RelationsList: FC<RelationsListProps> = ({ relations }) => {
  if (!relations?.length) return null

  return (
    <div className="flex w-full flex-col gap-4">
      {relations.map(({ relation, entry }) => (
        <div key={relation} className="flex flex-col gap-1.5 sm:flex-row sm:gap-4">
          <CategoryLabel className="shrink-0 sm:w-40">{relation}</CategoryLabel>
          <div className="flex flex-wrap gap-x-2 gap-y-1">
            {entry.map((item, index) => (
              <span key={item.mal_id} className="text-sm text-foreground">
                <Link
                  href={item.url}
                  target="_blank"
                  className="underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
                >
                  {item.name}
                </Link>
                {index < entry.length - 1 ? "," : ""}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
