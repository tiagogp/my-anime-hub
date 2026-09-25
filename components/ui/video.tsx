"use client"

import { useState } from "react"
import { LucidePlay } from "lucide-react"
import LiteYouTubeEmbed, { LiteYouTubeProps } from "react-lite-youtube-embed"

import { cn } from "@/lib/utils"

export function Video({
  id,
  title,
  wrapperClass,
  iframeClass,
  playerClass,
  ...rest
}: LiteYouTubeProps) {
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
        wrapperClass={cn(
          "relative aspect-video w-full bg-cover bg-center bg-no-repeat [&>.lty-thumbnail]:absolute [&>.lty-thumbnail]:inset-0 [&>.lty-thumbnail]:size-full [&>.lty-thumbnail]:object-cover [&>.lty-thumbnail]:object-center",
          wrapperClass
        )}
        iframeClass={cn("absolute inset-0 size-full", iframeClass)}
        playerClass={cn(
          "absolute inset-0 size-full [&>span]:sr-only",
          playerClass
        )}
        hideButtonOnActivate
        onIframeAdded={() => setIsEnabled(true)}
      />
    </div>
  )
}
