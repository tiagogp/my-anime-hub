import { FC } from "react"
import Link from "next/link"

import type { ExternalLink } from "@/config/services/types"

import { CategoryLabel } from "../ui/category-label"

interface ExternalLinksProps {
  streaming?: ExternalLink[]
  external?: ExternalLink[]
}

const LinkGroup: FC<{ label: string; links: ExternalLink[] }> = ({
  label,
  links,
}) => (
  <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
    <CategoryLabel className="shrink-0 sm:w-40">{label}</CategoryLabel>
    <div className="flex flex-wrap gap-2">
      {links.map((link) => (
        <Link
          key={link.url}
          href={link.url}
          target="_blank"
          className="border border-border px-3 py-1.5 font-mono text-xs text-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
        >
          {link.name}
        </Link>
      ))}
    </div>
  </div>
)

export const ExternalLinks: FC<ExternalLinksProps> = ({
  streaming,
  external,
}) => {
  if (!streaming?.length && !external?.length) return null

  return (
    <div className="flex w-full flex-col gap-4">
      {streaming?.length ? (
        <LinkGroup label="Where to watch" links={streaming} />
      ) : null}
      {external?.length ? <LinkGroup label="External" links={external} /> : null}
    </div>
  )
}
