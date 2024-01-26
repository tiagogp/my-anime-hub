"use client"

import * as React from "react"
import Link from "next/link"

import { NavItem } from "@/types/nav"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

export function MainNav() {
  return (
    <div className="flex gap-6 md:gap-10 ">
      <Link href="/" className="flex items-center ">
        <Icons.logo className="h-7" />
      </Link>
    </div>
  )
}
