import { cache } from 'react';
import { BASE_URL } from '../constants';


export const getMangaById = cache(async (id: string) => {
  const url = new URL(`${BASE_URL}/manga/${id}`);

  const response = await fetch(url, {
    cache: 'no-store'
  });

  return response.json();
})

