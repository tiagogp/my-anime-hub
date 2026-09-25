import Link from "next/link"

import { Icons } from "@/components/icons"

export function MainNav() {
  return (
    <Link
      href="/"
      aria-label="Home"
      className="flex shrink-0 items-center opacity-90 transition-opacity hover:opacity-100"
    >
      <Icons.logo className="h-6" />
    </Link>
  )
}
