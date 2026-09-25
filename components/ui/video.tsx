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
        "group relative flex w-full justify-center overflow-hidden border border-border",
        !isEnabled && "cursor-pointer"
      )}
    >
      {!isEnabled && (
        <div className="pointer-events-none absolute z-10 flex size-full items-center justify-center bg-background/60 transition-colors duration-200 ease-out group-hover:bg-background/40">
          <span className="flex size-12 items-center justify-center border border-foreground bg-background/80 text-foreground transition-colors duration-200 ease-out group-hover:bg-foreground group-hover:text-background">
            <LucidePlay className="ml-0.5 fill-current" size={18} />
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
