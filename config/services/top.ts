import { cache } from 'react'
import { BASE_URL } from '../constants'
import { convertValuesToURLSearchParams } from '@/lib/utils'

interface Params {
  limit?: string
  sfw?: boolean
}

export const getTopAnime = cache(async ({
  limit,
  sfw = true,
  ...props
}: Params) => {
  const params = {
    limit,
    sfw,
    ...props
  }

  const url = new URL(`${BASE_URL}/top/anime`);

  url.search = convertValuesToURLSearchParams(params)

  const response = await fetch(url)

  return response.json()
})