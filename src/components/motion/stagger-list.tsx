"use client";

import { motion, useReducedMotion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 }
};

export function StaggerList({ children, className }: Readonly<{ children: React.ReactNode; className?: string }>) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {Array.isArray(children)
        ? children.map((child, index) => (
            <motion.div key={index} variants={item} transition={{ duration: 0.55, ease: "easeOut" }}>
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}
