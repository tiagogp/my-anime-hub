import { cache } from 'react';
import { BASE_URL } from '../constants';

export const getAnimeById = cache(async (id: string) => {
  const url = new URL(`${BASE_URL}/anime/${id}`);

  const response = await fetch(url);

  return response.json();
})