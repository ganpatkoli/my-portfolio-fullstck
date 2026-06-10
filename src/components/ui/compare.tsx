"use client";
import React, { useState, useRef, useCallback } from "react";
import { cn } from "../../lib/utils";

interface CompareProps {
  firstImage?: string;
  secondImage?: string;
  className?: string;
  firstImageClassName?: string;
  secondImageClassName?: string;
  initialSliderPercentage?: number;
  slideMode?: "hover" | "drag";
  showHandlebar?: boolean;
}

export const Compare = ({
  firstImage = "",
  secondImage = "",
  className,
  firstImageClassName,
  secondImageClassName,
  initialSliderPercentage = 50,
  slideMode = "hover",
  showHandlebar = true,
}: CompareProps) => {
  const [sliderPosition, setSliderPosition] = useState(initialSliderPercentage);
  const [isDragging, setIsDragging] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // 1. Image Compare partition sliding logic
    if (slideMode === "hover" || (slideMode === "drag" && isDragging)) {
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percentage);
    }
    
    // 2. 3D Parallax Tilt calculation
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    const rY = (mouseX / (width / 2)) * 12;
    const rX = -(mouseY / (height / 2)) * 12;
    
    setRotateX(rX);
    setRotateY(rY);
  }, [slideMode, isDragging]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    if (slideMode === "hover" || (slideMode === "drag" && isDragging)) {
      if (e.touches && e.touches[0]) {
        const clientX = e.touches[0].clientX;
        const x = clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
        setSliderPosition(percentage);
      }
    }
  }, [slideMode, isDragging]);

  const handleMouseLeave = () => {
    if (slideMode === "drag") setIsDragging(false);
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseDown={() => slideMode === "drag" && setIsDragging(true)}
      onMouseUp={() => slideMode === "drag" && setIsDragging(false)}
      onTouchStart={() => slideMode === "drag" && setIsDragging(true)}
      onTouchEnd={() => slideMode === "drag" && setIsDragging(false)}
      style={{
        transformStyle: "preserve-3d",
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: isHovered ? "none" : "transform 0.5s cubic-bezier(0.1, 0.8, 0.2, 1)",
      }}
      className={cn(
        "relative w-full h-full overflow-hidden rounded-2xl  select-none cursor-ew-resize",
        className
      )}
    >
      {/* First Image (Background) */}
      <div className="absolute inset-0 w-full h-full z-0" style={{ transform: "translateZ(0px)" }}>
        <img
          src={firstImage}
          alt="First Image"
          className={cn(
            "w-full h-full object-cover object-top pointer-events-none select-none",
            firstImageClassName
          )}
        />
      </div>

      {/* Second Image (Clipped Overlay) */}
      <div
        className="absolute inset-0 w-full h-full z-10 overflow-hidden pointer-events-none"
        style={{
          clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
          WebkitClipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
          transform: "translateZ(0px)"
        }}
      >
        <img
          src={secondImage}
          alt="Second Image"
          className={cn(
            "w-full h-full object-cover object-top pointer-events-none select-none",
            secondImageClassName
          )}
        />
      </div>

      {/* Handlebar */}
      {showHandlebar && (
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-white z-20 pointer-events-none flex items-center justify-center"
          style={{ 
            left: `${sliderPosition}%`, 
            transform: "translateX(-50%) translateZ(40px)" 
          }}
        >
          <div className="w-8 h-8 rounded-full bg-white shadow-lg  flex items-center justify-center cursor-ew-resize">
            <svg
              className="w-4 h-4 text-neutral-650"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M8 9l4-4 4 4m0 6l-4 4-4-4"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};
