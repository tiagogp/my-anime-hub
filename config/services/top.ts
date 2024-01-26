import { cache } from 'react'
import { api } from '../api'
import { BASE_URL } from '../constants'

interface Params {
  limit?: number
}


export const getTopAnime = cache(async ({
  limit
}: Params) => {
  const response = await fetch(BASE_URL + `/top/anime?sfw=true${limit ? `&limit=${limit}` : ''}`, {
    method: 'GET'
  })

  return response.json()
})