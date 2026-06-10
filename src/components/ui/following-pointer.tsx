import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence, useMotionValue, type MotionValue } from "framer-motion";

interface FollowingPointerProps {
  children: ReactNode;
  title?: string | ReactNode;
  className?: string;
}

export const FollowerPointerCard = ({
  children,
  title,
  className = "",
}: FollowingPointerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [isInside, setIsInside] = useState(false);

  useEffect(() => {
    if (ref.current) {
      setRect(ref.current.getBoundingClientRect());
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (ref.current) {
      const currentRect = ref.current.getBoundingClientRect();
      setRect(currentRect);
      x.set(e.clientX - currentRect.left);
      y.set(e.clientY - currentRect.top);
    }
  };

  const handleMouseEnter = () => {
    setIsInside(true);
  };

  const handleMouseLeave = () => {
    setIsInside(false);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative ${className}`}
      style={{ cursor: "none" }}
    >
      <AnimatePresence>
        {isInside && rect && (
          <FollowPointer x={x} y={y} title={title} />
        )}
      </AnimatePresence>
      {children}
    </div>
  );
};

interface FollowPointerProps {
  x: MotionValue<number>;
  y: MotionValue<number>;
  title?: string | ReactNode;
}

const FollowPointer = ({ x, y, title }: FollowPointerProps) => {
  return (
    <motion.div
      className="absolute z-[99999] pointer-events-none"
      style={{
        top: y,
        left: x,
      }}
      initial={{
        scale: 0,
        opacity: 0,
      }}
      animate={{
        scale: 1,
        opacity: 1,
      }}
      exit={{
        scale: 0,
        opacity: 0,
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 28,
        mass: 0.5,
      }}
    >
      {/* Pointer SVG */}
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="1"
        viewBox="0 0 16 16"
        className="h-4 w-4 -translate-x-[12px] -translate-y-[10px] -rotate-[70deg] transform stroke-white text-white"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z" />
      </svg>

      {/* Title badge */}
      {title && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          className="ml-2 mt-0.5 rounded-full bg-white px-2 py-1 text-[10px] font-bold text-black whitespace-nowrap shadow-lg"
        >
          {title}
        </motion.div>
      )}
    </motion.div>
  );
};
