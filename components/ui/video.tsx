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
        "group relative flex w-full justify-center overflow-hidden rounded-md",
        !isEnabled && "cursor-pointer"
      )}
    >
      {!isEnabled && (
        <div className="pointer-events-none absolute z-10 flex size-full items-center justify-center bg-gradient-to-t from-black/75 via-black/25 to-black/45 transition-all duration-300 group-hover:from-black/85 group-hover:via-black/35 group-hover:to-black/55">
          <span className="relative flex items-center justify-center">
            <span className="absolute size-14 animate-ping rounded-full bg-primary/60 opacity-0 group-hover:opacity-100" />
            <span className="relative flex size-14 items-center justify-center rounded-full border border-white/20 bg-primary/90 shadow-lg shadow-primary/40 backdrop-blur-sm transition-transform duration-300 ease-out group-hover:scale-110">
              <LucidePlay
                className="ml-0.5 fill-primary-foreground stroke-primary-foreground"
                size={22}
              />
            </span>
          </span>
        </div>
      )}

      <LiteYouTubeEmbed
        {...rest}
        id={id}
        title={title}
        hideButtonOnActivate
        onIframeAdded={() => setIsEnabled(true)}
      />
    </div>
  )
}
