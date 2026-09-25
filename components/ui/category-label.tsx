import { FC, HTMLAttributes } from "react"

import { cn } from "@/lib/utils"

export const CategoryLabel: FC<HTMLAttributes<HTMLSpanElement>> = ({
  className,
  children,
  ...props
}) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 font-mono text-[0.6875rem] uppercase tracking-widest text-muted-foreground",
      className
    )}
    {...props}
  >
    {children}
  </span>
)
