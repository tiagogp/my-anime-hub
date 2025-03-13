"use client"

import { motion } from "framer-motion"

interface SectionAnimatedProps {
  children: React.ReactNode
  className?: string
}

export const SectionAnimated = ({
  children,
  ...props
}: SectionAnimatedProps) => (
  <motion.section
    initial={{ opacity: 0, y: 100 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, stiffness: 100, bounce: 0, ease: "easeInOut" }}
    {...props}
  >
    {children}
  </motion.section>
)
