import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

export const GlobalCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoverText, setHoverText] = useState<string | null>(null);
  const isTouch = useRef(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  const getHoverText = useCallback((target: HTMLElement): string | null => {
    // Check for custom data attribute first
    const card = target.closest("[data-cursor-text]");
    if (card) return card.getAttribute("data-cursor-text");

    // Check for links
    const link = target.closest("a") as HTMLAnchorElement | null;
    if (link) {
      return (
        link.getAttribute("aria-label") ||
        link.innerText?.trim().slice(0, 24) ||
        "Link"
      );
    }

    // Check for buttons
    const button = target.closest("button") as HTMLButtonElement | null;
    if (button) {
      return (
        button.getAttribute("aria-label") ||
        button.innerText?.trim().slice(0, 24) ||
        "Click"
      );
    }

    // Check for any clickable role
    const clickable = target.closest("[role='button'], [onclick]");
    if (clickable) return "Click";

    return null;
  }, []);

  useEffect(() => {
    // Detect touch device
    if (window.matchMedia("(pointer: coarse)").matches) {
      isTouch.current = true;
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setHoverText(getHoverText(target));
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    document.documentElement.addEventListener("mouseenter", onMouseEnter);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      document.documentElement.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [cursorX, cursorY, getHoverText]);

  // Don't render anything on touch devices
  if (isTouch.current) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none"
      style={{
        x: smoothX,
        y: smoothY,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ opacity: { duration: 0.12 } }}
    >
      {/* Aceternity-style Pointer Arrow SVG */}
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="1"
        viewBox="0 0 16 16"
        className="h-6 w-6 -translate-x-[14px] -translate-y-[12px] -rotate-[70deg] transform stroke-violet-600 text-violet-500 drop-shadow-[0_2px_6px_rgba(139,92,246,0.5)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z" />
      </svg>

      {/* Hover label badge — appears on interactive elements */}
      <AnimatePresence>
        {hoverText && (
          <motion.div
            key={hoverText}
            initial={{ scale: 0.5, opacity: 0, y: -2 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: -2 }}
            transition={{ type: "spring", stiffness: 500, damping: 25, mass: 0.5 }}
            className="absolute left-6 top-0 rounded-full bg-violet-500 px-3 py-1.5 text-[10px] font-bold text-white whitespace-nowrap shadow-[0_4px_16px_rgba(139,92,246,0.4)] max-w-[180px] truncate"
          >
            {hoverText}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
