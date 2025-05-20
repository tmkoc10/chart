import * as React from "react"
import { motion } from 'framer-motion';

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <motion.input
      type={type}
      data-slot="input"
      whileFocus={{ boxShadow: '0 0 0 2px #fff, 0 0 8px #fff8' }}
      whileHover={{ borderColor: '#fff' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={cn(
        "flex h-10 w-full min-w-0 rounded-lg border border-[#333] bg-[#1A1A1A] px-3 py-2 text-base text-white shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#ccc] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white focus-visible:border-white disabled:cursor-not-allowed disabled:opacity-50 md:text-sm font-inter",
        className
      )}
      {...props}
    />
  )
}

export { Input }
