"use client"

import * as React from "react"
import { Icons } from "@/components/icons"
import { useRouter } from 'next/navigation'

export function MainNav() {
  const { push } = useRouter()

  return (
    <div className="flex gap-6 md:gap-10 ">
      <button onClick={() => push('/')} className="flex items-center ">
        <Icons.logo className="h-7" />
      </button>
    </div>
  )
}
