import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from 'framer-motion'

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-black/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive active:scale-95 active:shadow-inner shadow-md",
  {
    variants: {
      variant: {
        default:
          "bg-white text-black border border-neutral-300 hover:bg-neutral-100 hover:shadow-lg",
        destructive:
          "bg-black text-white border border-black hover:bg-neutral-800 hover:shadow-lg focus-visible:ring-white/20",
        outline:
          "border border-neutral-300 bg-transparent hover:bg-black hover:text-white hover:shadow-lg",
        secondary:
          "bg-neutral-100 text-black border border-neutral-300 hover:bg-neutral-200 hover:shadow-lg",
        ghost:
          "hover:bg-neutral-100 hover:text-black",
        link: "text-black underline-offset-4 hover:underline hover:text-neutral-700",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-9 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-11 rounded-md px-8 has-[>svg]:px-6",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : motion.button

  // Remove native drag and animation event handlers to avoid type conflict with Framer Motion
  const { onDrag, onDragEnd, onDragStart, onDragOver, onAnimationStart, onAnimationEnd, ...rest } = props

  return (
    <Comp
      data-slot="button"
      whileHover={{ scale: 1.03, boxShadow: '0 0 0 2px #fff, 0 0 8px #fff8' }}
      whileTap={{ scale: 0.97, filter: 'brightness(0.85)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(buttonVariants({ variant, size, className }))}
      {...rest}
    />
  )
}

export { Button, buttonVariants }
