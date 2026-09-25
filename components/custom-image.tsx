"use client"

import React, { useEffect, useState } from "react"

interface CustomImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  fallback?: string
  lazy?: boolean
}

export function Image({
  src,
  alt,
  fallback,
  lazy = true,
  className,
  onError,
  ...props
}: CustomImageProps) {
  const [failedSources, setFailedSources] = useState<string[]>([])
  useEffect(() => setFailedSources([]), [src, fallback])
  const imageSrc =
    [src, fallback].find(
      (candidate) => candidate && !failedSources.includes(candidate)
    ) || "/cover-placeholder.svg"

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      src={imageSrc}
      alt={alt}
      loading={lazy ? "lazy" : undefined}
      onError={(event) => {
        if (imageSrc !== "/cover-placeholder.svg") {
          setFailedSources((sources) => [...sources, imageSrc])
        }
        onError?.(event)
      }}
      className={className}
      style={{
        transition: "opacity 0.3s ease",
        ...props.style,
      }}
    />
  )
}
