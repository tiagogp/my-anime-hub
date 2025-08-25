"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

import Aurora from "./aurora"

type BackgroundImageProps = {
  src: string
  alt: string
}

export const BackgroundImage = ({ src, alt }: BackgroundImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <>
      <Aurora blend={0.5} amplitude={1.0} speed={0.5} imageURL={src} />
      <motion.div
        initial={{ opacity: 0, filter: "blur(40px)" }}
        animate={isLoaded ? { opacity: 1, filter: "blur(10px)" } : undefined}
        transition={{ duration: 0.6 }}
        className="absolute top-0 -z-20 h-svh w-full"
      >
        <Image
          src={src}
          alt={alt}
          width={224}
          height={300}
          onLoad={() => setIsLoaded(true)}
          className="h-svh w-full object-cover opacity-30 mix-blend-darken dark:opacity-10"
        />
      </motion.div>
    </>
  )
}

export default BackgroundImage
