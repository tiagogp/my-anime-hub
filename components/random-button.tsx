"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Shuffle } from "lucide-react"

import { getRandomAnime, getRandomManga } from "@/config/services/random"
import { cn } from "@/lib/utils"

interface RandomButtonProps {
  type: "anime" | "manga"
  className?: string
}

export const RandomButton = ({ type, className }: RandomButtonProps) => {
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { push } = useRouter()

  const handleClick = async () => {
    setIsLoading(true)

    setError("")
    try {
      const { data } =
        type === "anime" ? await getRandomAnime() : await getRandomManga()
      push(`/${type}/${data.route_id ?? data.mal_id}`)
    } catch {
      setError("Unable to load. Try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        "flex items-center gap-2 border border-border px-3 py-2 font-mono text-xs uppercase tracking-[0.04em] text-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-background disabled:opacity-50",
        className
      )}
    >
      <Shuffle size={13} className={cn(isLoading && "animate-pulse")} />
      {error || "Surprise me"}
    </button>
  )
}
