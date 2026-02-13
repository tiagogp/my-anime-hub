"use client"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"

import Aurora from "./aurora"
import { Image } from "./custom-image"

type BackgroundImageProps = {
  src: string
  alt: string
}

export const BackgroundImage = ({ src, alt }: BackgroundImageProps) => {
  const theme = useTheme()
  console.log({ theme })
  const opacity = theme?.resolvedTheme === "light" ? 0.7 : 0.9

  return (
    <>
      <motion.div className="absolute bottom-0 z-20 min-h-screen w-full bg-gradient-to-b from-background/50 to-transparent dark:from-background/90" />

      <Aurora
        opacity={opacity}
        blend={0.5}
        amplitude={1.0}
        speed={0.5}
        imageURL={src}
      />
      <motion.div
        initial={{ opacity: 0, filter: "blur(100px)" }}
        animate={{ opacity: 1, filter: "blur(5px)" }}
        transition={{ duration: 1.2 }}
        className="absolute top-0 -z-20 h-svh w-full"
      >
        <Image
          src={src}
          alt={alt}
          width={224}
          height={300}
          className="h-svh w-full object-cover opacity-50 dark:opacity-25"
        />
      </motion.div>
    </>
  )
}

export default BackgroundImage
