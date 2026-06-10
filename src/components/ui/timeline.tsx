import React, { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

export interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export interface TimelineProps {
  data: TimelineEntry[];
}

export const Timeline = ({ data }: TimelineProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setContainerHeight(rect.height);
    }
  }, [containerRef]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 90%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, containerHeight]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full md:px-10 transition-colors duration-300"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto py-24 px-6 md:px-8 lg:px-10">
        <div className="text-left space-y-4">
          <div className="text-violet-600 dark:text-violet-400 text-sm font-semibold uppercase tracking-widest">
            Milestones
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Experience & Tech Stack
          </h2>
          <p className="text-neutral-600 dark:text-slate-400 text-sm md:text-base max-w-xl leading-relaxed">
            A chronological timeline detailing my professional experience, project milestones, and tech stack portfolio.
          </p>
        </div>
      </div>
 
      <div className="relative max-w-7xl mx-auto pb-24">
        {/* The Timeline line - mathematically centered on dot nodes */}
        <div
          style={{
            height: containerHeight + "px",
          }}
          className="absolute left-5 md:left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent via-neutral-200 dark:via-neutral-800 to-transparent [mask-image:linear-gradient(to_bottom,transparent_0%,black_8%,black_92%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-fuchsia-500 via-violet-500 to-transparent from-[0%] via-[50%] rounded-full shadow-[0_0_12px_2px_rgba(168,85,247,0.4)]"
          />
        </div>
 
        {data.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
            className="flex justify-start pt-12 md:pt-36 md:gap-12"
          >
            {/* Sticky Marker Node - center aligned exactly with left-5 / md:left-8 line */}
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-0 md:left-3 w-10 rounded-full bg-white dark:bg-neutral-950 flex items-center justify-center border border-neutral-200 dark:border-white/10 group">
                <div className="h-4 w-4 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 group-hover:bg-purple-500 transition-colors duration-300" />
              </div>
              <h3 className="hidden md:block text-lg md:pl-20 md:text-xl lg:text-2xl font-black text-neutral-500 dark:text-neutral-500 tracking-tight transition-colors duration-300 whitespace-nowrap">
                {item.title}
              </h3>
            </div>
 
            {/* Entry Content Card */}
            <div className="relative pl-16 pr-6 md:pl-4 w-full">
              <h3 className="md:hidden block text-lg mb-4 text-left font-bold text-neutral-500 dark:text-neutral-550 transition-colors duration-300">
                {item.title}
              </h3>
              <div className="bg-white/60 dark:bg-neutral-900/10 backdrop-blur-md border border-neutral-200 dark:border-white/5 rounded-2xl p-6 md:p-8 hover:border-violet-500/20 hover:shadow-[0_15px_35px_rgba(139,92,246,0.02)] transition-all duration-500">
                {item.content}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
