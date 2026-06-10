import React from "react";
import { motion } from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  scale?: number;
  blur?: boolean;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  delay = 0,
  y = 40,
  x = 0,
  scale = 0.98,
  blur = true,
  duration = 0.8,
  direction = "up"
}) => {
  // Determine initial coordinates based on direction
  let initialY = y;
  let initialX = x;

  if (direction === "down") {
    initialY = -y;
    initialX = 0;
  } else if (direction === "left") {
    initialY = 0;
    initialX = y; // slide from right to left
  } else if (direction === "right") {
    initialY = 0;
    initialX = -y; // slide from left to right
  } else if (direction === "none") {
    initialY = 0;
    initialX = 0;
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: initialY,
        x: initialX,
        scale: scale,
        filter: blur ? "blur(8px)" : "none"
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        filter: "blur(0px)"
      }}
      viewport={{ 
        once: false, // Animates both when scrolling top to bottom and bottom to top
        amount: 0.15 // Triggers when 15% of the element is visible
      }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.16, 1, 0.3, 1] // Custom premium easeOutExpo (typical of Aceternity UI)
      }}
    >
      {children}
    </motion.div>
  );
};
