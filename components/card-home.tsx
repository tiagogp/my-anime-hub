import { DataSessionProps } from '@/config/services/seasons';
import Image from 'next/image';
import { FC } from 'react';

interface CardHomeProps extends DataSessionProps {
  index: number;
}

export const CardHome: FC<CardHomeProps> = (
  {
    index,
    mal_id,
    images: {
      jpg: { image_url }
    },
    title,
    type,
    episodes,
    score,
    members
  }
) => (
  <div className='flex cursor-pointer gap-4 p-4 hover:bg-border/30'>
    <span className='font-bold'>
      {index}
    </span>
    <Image
      src={image_url}
      alt={title}
      width={100}
      height={64}
      className='h-20 w-14 rounded object-cover'
    />
    <div>
      <h2 className='text-sm font-bold'>{title}</h2>
      <p className='text-xs opacity-50'>{type}, {episodes} eps, scored {score}</p>
      <p className='text-xs opacity-50'>{
        Intl.NumberFormat('en-US', {
          notation: 'compact',
          compactDisplay: 'short'
        }).format(members)
      }</p>
    </div>
  </div>
)
