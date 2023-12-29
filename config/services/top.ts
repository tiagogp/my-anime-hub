import { api } from '../api'

interface Params {
  limit?: number
}


export const getTopAnime = async ({
  limit
}: Params) => {
  const { data } = await api.get(`/top/anime?sfw=true${limit ? `&limit=${limit}` : ''}`)

  return data
}