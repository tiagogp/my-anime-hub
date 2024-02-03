interface VideoProps {
  url: string
}

export function Video({
  url
}: VideoProps) {
  return (
    <iframe
      width="560"
      height="315"
      src={url}
      allowFullScreen
      loading='lazy'
      className="aspect-video size-full rounded-md outline outline-border sm:w-72"
      allow="accelerometer; no-autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    />
  )
}
