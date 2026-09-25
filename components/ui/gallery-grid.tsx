import { FC, ReactNode } from "react"

import { cn } from "@/lib/utils"

interface GalleryGridProps {
  children: ReactNode
  className?: string
}

export const GalleryGrid: FC<GalleryGridProps> = ({ children, className }) => (
  <div
    className={cn(
      "grid w-full grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 md:gap-x-6 md:gap-y-10 lg:grid-cols-4 xl:grid-cols-5",
      className
    )}
  >
    {children}
  </div>
)
