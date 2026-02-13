import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { BASE_URL } from "@/config/constants"
import type { DataSessionProps } from "@/config/services/types"

import { PAGES_LENGTH } from "./constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getYoutubeIdFromEmbedUrl = (url: string): string | null => {
  if (!url) return null

  const match = url.match(/embed\/([^?]+)/)

  return match ? match[1] : null
}

export function convertValuesToURLSearchParams(params: any) {
  const urlSearchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    urlSearchParams.append(key, value as string)
  })

  return urlSearchParams.toString()
}

export function paginate(
  dataLength: number,
  correctPage: number,
  perPage = PAGES_LENGTH
) {
  const pages = Array.from({ length: dataLength }, (_, i) => i + 1)

  const results = pages.reduce((acc, _, index, array) => {
    if (index % perPage === 0) {
      acc.push(array.slice(index, index + perPage))
    }
    return acc
  }, [] as number[][])

  const actualPageIndex = results.findIndex((page) =>
    page.includes(Number(correctPage))
  )

  const result = pages.length > perPage ? results[actualPageIndex] : results[0]

  return result
}

export const formatterSessionUpcoming = (
  data: DataSessionProps[],
  slice?: number
) =>
  data
    .reduce((acc, cur) => {
      const existOnAcc = acc.find((e) => e.title === cur.title)

      if (existOnAcc) {
        return acc
      }

      return [...acc, cur]
    }, [] as DataSessionProps[])
    .slice(0, slice || 10)

export const formatterUrl = (search?: string, page?: number) => {
  const url = new URL(`${BASE_URL}/manga`)
  const params = { search, page }

  url.search = convertValuesToURLSearchParams(params)

  return url.toString()
}

export const getCurrentPage = (page?: string) => Math.max(Number(page) || 1, 1)

type NavItemsProps = {
  icon: JSX.Element
  title: string
  href: string
  alternativePath?: string
  disabled?: boolean
}[]

export const getActiveNavItemIndex = (
  navItems: NavItemsProps,
  correctedPath: string,
  pathname: string
) => {
  const reduced = navItems.reduce((acc, item, index) => {
    const corrected =
      item.href.split("/").length > 1
        ? item.href.split("/").filter((item) => item !== "")[0]
        : item.href

    if (corrected === correctedPath) {
      acc = index
    }

    if (corrected !== correctedPath && item?.alternativePath === pathname) {
      acc = index
    }
    return acc
  }, 0)

  return reduced
}
