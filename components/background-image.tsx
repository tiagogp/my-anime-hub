"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"

import Aurora from "./aurora"
import { Image } from "./custom-image"

type BackgroundImageProps = {
  src: string
  alt: string
  color?: string | null
}

export const BackgroundImage = ({ src, alt, color }: BackgroundImageProps) => {
  const colors = useMemo(() => {
    if (!color || !/^#[0-9a-f]{6}$/i.test(color)) return undefined
    return [color, "#252525", color]
  }, [color])
  const { resolvedTheme } = useTheme()
  const opacity = resolvedTheme === "light" ? 0.55 : 0.85

  return (
    <div
      role="img"
      aria-label={alt}
      className="absolute inset-x-0 top-0 h-[60vh] min-h-[420px] w-full overflow-hidden"
    >
      <motion.div className="absolute top-0 z-20 size-full bg-gradient-to-b from-background/40 via-background/70 to-background" />

      <Aurora
        opacity={opacity}
        blend={0.35}
        amplitude={0.8}
        speed={0.4}
        colorStops={colors}
      />
      <motion.div
        initial={{ opacity: 0, filter: "blur(120px)" }}
        animate={{ opacity: 1, filter: "blur(6px)" }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 -z-20"
      >
        <Image
          src={src}
          alt=""
          width={224}
          height={300}
          className="size-full object-cover opacity-40 dark:opacity-25"
        />
      </motion.div>
    </div>
  )
}

export default BackgroundImage
