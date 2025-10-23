"use client"

import { motion } from "framer-motion"

import Aurora from "./aurora"
import { Image } from "./custom-image"

type BackgroundImageProps = {
  src: string
  alt: string
}

export const BackgroundImage = ({ src, alt }: BackgroundImageProps) => {
  return (
    <>
      <Aurora blend={0.5} amplitude={1.0} speed={0.5} imageURL={src} />
      <motion.div
        initial={{ opacity: 0, filter: "blur(40px)" }}
        animate={{ opacity: 1, filter: "blur(10px)" }}
        transition={{ duration: 0.6 }}
        className="absolute top-0 -z-20 h-svh w-full"
      >
        <Image
          src={src}
          alt={alt}
          width={224}
          height={300}
          className="h-svh w-full object-cover opacity-30 mix-blend-darken dark:opacity-10"
        />
      </motion.div>
    </>
  )
}

export default BackgroundImage
