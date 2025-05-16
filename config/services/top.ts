import { cache } from "react"

import { convertValuesToURLSearchParams } from "@/lib/utils"

import { BASE_URL } from "../constants"
import type { SessionsProps } from "./seasons"

interface Params {
  limit?: string
  sfw?: boolean
  page?: number
  q?: string
}

export const getTopAnime = cache(
  async ({ limit, sfw = true, ...props }: Params): Promise<SessionsProps> => {
    const params = {
      limit,
      sfw,
      ...props,
    }

    const url = new URL(`${BASE_URL}/top/anime`)

    url.search = convertValuesToURLSearchParams(params)

    const response = await fetch(url)

    return response.json()
  }
)

export const getTopManga = cache(
  async ({ limit, sfw = true, ...props }: Params): Promise<SessionsProps> => {
    const params = {
      limit,
      sfw,
      ...props,
    }

    const url = new URL(`${BASE_URL}/top/manga`)

    url.search = convertValuesToURLSearchParams(params)

    const response = await fetch(url)

    return response.json()
  }
)

export const getManga = cache(
  async ({ limit, sfw = true, ...props }: Params): Promise<SessionsProps> => {
    const params = {
      limit,
      sfw,
      ...props,
    }

    const url = new URL(`${BASE_URL}/manga`)

    url.search = convertValuesToURLSearchParams(params)

    const response = await fetch(url)

    return response.json()
  }
)

interface FetchMangaProps {
  search?: string
  page?: number
  currentPage?: number
}

export const fetchMangaData = async ({
  search,
  page,
  currentPage,
}: FetchMangaProps): Promise<SessionsProps> => {
  if (search) {
    return await getManga({
      limit: "25",
      ...(search && {
        q: search,
      }),
      ...(page && {
        page: currentPage,
      }),
    })
  }

  return await getTopManga({
    limit: "25",
    ...(page && {
      page: currentPage,
    }),
  })
}
