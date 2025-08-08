import { cache } from "react"

import { convertValuesToURLSearchParams } from "@/lib/utils"

import { BASE_URL } from "../constants"
import type { Params, SessionsProps } from "./types"

export const getSessionNow = cache(
  async ({ limit, sfw = true, ...props }: Params): Promise<SessionsProps> => {
    const params = {
      limit,
      sfw,
      ...props,
    }

    const url = new URL(`${BASE_URL}/seasons/now`)

    url.search = convertValuesToURLSearchParams(params)

    const response = await fetch(url)

    return response.json()
  }
)

export const getSessionUpcoming = cache(
  async ({ limit, sfw = true, ...props }: Params): Promise<SessionsProps> => {
    const params = {
      limit,
      sfw,
      ...props,
    }

    const url = new URL(`${BASE_URL}/seasons/upcoming`)

    url.search = convertValuesToURLSearchParams(params)

    const response = await fetch(url)

    return response.json()
  }
)
