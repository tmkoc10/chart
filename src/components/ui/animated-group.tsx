'use client';
import { ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';
import React from 'react';

export type PresetType =
  | 'fade'
  | 'slide'
  | 'scale'
  | 'blur'
  | 'blur-slide'
  | 'zoom'
  | 'flip'
  | 'bounce'
  | 'rotate'
  | 'swing';

export type AnimatedGroupProps = {
  children: ReactNode;
  className?: string;
  variants?: {
    container?: Variants;
    item?: Variants;
  };
  preset?: PresetType;
  as?: React.ElementType;
  asChild?: React.ElementType;
};

// Simple default variants
const defaultContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const defaultItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

function AnimatedGroup({
  children,
  className,
  variants,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  preset,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  as = 'div',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  asChild = 'div',
}: AnimatedGroupProps) {
  // Use provided variants if available, or defaults
  const containerVariants = variants?.container || defaultContainerVariants;
  const itemVariants = variants?.item || defaultItemVariants;

  // Render with motion.div as default
  const Container = motion.div;
  const Child = motion.div;

  return (
    <Container
      initial='hidden'
      animate='visible'
      variants={containerVariants}
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <Child key={index} variants={itemVariants}>
          {child}
        </Child>
      ))}
    </Container>
  );
}

export { AnimatedGroup };
