import { FC } from "react"
import Link from "next/link"

import type { DataSessionProps } from "@/config/services/types"
import { cn } from "@/lib/utils"

import { Image } from "./custom-image"

interface CardHomeProps extends DataSessionProps {
  index: number
  className?: string
  link: string
}

export const CardHome: FC<CardHomeProps> = ({
  index,
  mal_id,
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
    href={`${link}/${mal_id}`}
    className={cn(
      "flex cursor-pointer gap-4 border-b p-4 last-of-type:border-b hover:bg-border/30",
      className
    )}
  >
    <span className="font-bold">{index}</span>
    <Image
      src={image_url}
      alt={title}
      width={100}
      height={64}
      className="h-20 w-14 rounded object-cover"
    />
    <div>
      <h2 className="max-w-full text-sm font-bold">{title}</h2>
      <p className="text-xs opacity-70">
        {type},{" "}
        {episodes ? `${episodes} eps,` : chapters && `${chapters} chapters,`}{" "}
        scored {score}
      </p>
      <p className="text-xs opacity-70">
        {Intl.NumberFormat("en-US", {
          notation: "compact",
          compactDisplay: "short",
        }).format(members)}
      </p>
      {genres.length ? (
        <p className="text-xs opacity-70">
          Genres:{" "}
          {genres.reduce(
            (prev, curr, i) =>
              i === genres.length - 1
                ? `${prev} ${curr.name}.`
                : `${prev} ${curr.name},`,
            ""
          )}
        </p>
      ) : null}
    </div>
  </Link>
)
