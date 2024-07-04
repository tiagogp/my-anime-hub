'use client'

import Image from 'next/image'
import { usePalette } from 'react-palette'

type BackgroundImageProps = {
  src: string
  alt: string
}

export const BackgroundImage = ({ src, alt }: BackgroundImageProps) => {
  const { data, loading, error } = usePalette(src)

  return (
    <div>
      <div
        style={{
          background: `linear-gradient(${data?.lightVibrant || 'transparent'}, ${data?.lightMuted || 'transparent'})`,
        }}
        className='absolute top-0 -z-10 h-svh w-full opacity-25 mix-blend-multiply dark:opacity-50'
      />
      <Image
        src={src}
        alt={alt}
        width={224}
        height={300}
        className="absolute top-0 -z-20 h-svh w-full object-cover opacity-20 blur-md "
      />
    </div>

  )
}