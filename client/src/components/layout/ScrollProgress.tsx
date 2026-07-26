import { motion, useScroll } from 'framer-motion'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 origin-left z-[100]"
      style={{ scaleX: scrollYProgress }}
    />
  )
}
