"use client"

import LiteYouTubeEmbed, {
  LiteYouTubeProps
} from 'react-lite-youtube-embed';

export function Video({
  id,
  title,
  ...rest
}: LiteYouTubeProps) {
  return (
    <LiteYouTubeEmbed
      id={id}
      title={title}
      {...rest}
    />
  )
}
