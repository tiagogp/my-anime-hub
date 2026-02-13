"use client"

import { useState } from "react"
import { LucidePlay } from "lucide-react"
import LiteYouTubeEmbed, { LiteYouTubeProps } from "react-lite-youtube-embed"

import { cn } from "@/lib/utils"

export function Video({ id, title, ...rest }: LiteYouTubeProps) {
  const [isEnabled, setIsEnabled] = useState(false)

  return (
    <div
      className={cn(
        "group relative flex w-full justify-center",
        !isEnabled && "cursor-pointer"
      )}
    >
      {!isEnabled && (
        <div className="pointer-events-none absolute z-10 flex size-full  items-center justify-center rounded-md bg-black/40  transition-all duration-300 group-hover:bg-black/60">
          <LucidePlay
            className="fill-white stroke-white transition-all duration-200 group-hover:scale-125"
            size={32}
          />
        </div>
      )}

      <LiteYouTubeEmbed
        {...rest}
        announce="  "
        id={id}
        title={title}
        onIframeAdded={() => setIsEnabled(true)}
      />
    </div>
  )
}
