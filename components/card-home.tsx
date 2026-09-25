import { FC } from "react"
import Link from "next/link"

import type { DataSessionProps } from "@/config/services/types"
import { cn } from "@/lib/utils"

import { Image } from "./custom-image"
import { CategoryLabel } from "./ui/category-label"

interface CardHomeProps extends DataSessionProps {
  index: number
  className?: string
  link: string
}

const formatMembers = (members: number) =>
  Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
  }).format(members)

export const CardHome: FC<CardHomeProps> = ({
  index,
  mal_id,
  route_id,
  images: {
    jpg: { image_url },
  },
  title,
  type,
  episodes,
  score,
  members,
  className,
  genres,
  chapters,
  link,
}) => (
  <Link
    href={`${link}/${route_id ?? mal_id}`}
    className={cn(
      "group flex min-w-0 flex-col border border-border transition-[filter,transform] duration-200 ease-out hover:brightness-110 focus-visible:brightness-110 motion-safe:hover:-translate-y-1",
      className
    )}
  >
    <div className="relative aspect-[3/4] w-full overflow-hidden bg-card">
      <Image
        src={image_url}
        alt={title}
        width={320}
        height={427}
        className="absolute inset-0 size-full object-cover"
      />
    </div>
    <div className="flex flex-1 flex-col gap-2 border-t border-border p-4">
      <CategoryLabel>
        № {String(index).padStart(2, "0")}
        {type ? ` · ${type}` : ""}
        {episodes ? ` · ${episodes} eps` : chapters ? ` · ${chapters} ch` : ""}
      </CategoryLabel>

      <h2 className="line-clamp-2 font-display text-[1.375rem] leading-[1.15] text-foreground transition-colors group-hover:text-muted-foreground lg:text-lg">
        {title}
      </h2>

      <p className="text-xs text-muted-foreground">
        Score {score ?? "N/A"} · {formatMembers(members)} members
      </p>

      {genres?.length ? (
        <p className="line-clamp-1 text-xs text-muted-foreground">
          {genres.map((genre) => genre.name).join(", ")}
        </p>
      ) : null}
    </div>
  </Link>
)
