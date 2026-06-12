import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as SiIcons from "react-icons/si";
import * as TbIcons from "react-icons/tb";
import { ScrollReveal } from "./ui/scroll-reveal";
import { API_BASE } from "../lib/api";

const getTechIcon = (name: string, size = 16): React.ReactNode => {
  if (name.startsWith("Tb")) {
    const IconComponent = (TbIcons as any)[name];
    if (IconComponent) return React.createElement(IconComponent, { size });
  } else {
    const IconComponent = (SiIcons as any)[name];
    if (IconComponent) return React.createElement(IconComponent, { size });
  }
  return React.createElement(TbIcons.TbBolt, { size });
};

interface TechSkill {
  name: string;
  category: "frontend" | "backend" | "databases" | "tools";
  iconName: string;
  hoverGlow: string;
}

const TECH_SKILLS: TechSkill[] = [
  // Frontend
  { name: "Next.js", category: "frontend", iconName: "SiNextdotjs", hoverGlow: "hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:border-neutral-450 dark:hover:border-neutral-600" },
  { name: "ReactJS", category: "frontend", iconName: "SiReact", hoverGlow: "hover:shadow-[0_0_15px_rgba(97,218,251,0.15)] hover:border-[#61DAFB]/40" },
  { name: "TypeScript", category: "frontend", iconName: "SiTypescript", hoverGlow: "hover:shadow-[0_0_15px_rgba(49,120,198,0.15)] hover:border-[#3178C6]/40" },
  { name: "Redux", category: "frontend", iconName: "SiRedux", hoverGlow: "hover:shadow-[0_0_15px_rgba(118,74,188,0.15)] hover:border-[#764ABC]/40" },
  { name: "Redux Toolkit", category: "frontend", iconName: "SiRedux", hoverGlow: "hover:shadow-[0_0_15px_rgba(118,74,188,0.15)] hover:border-[#764ABC]/40" },
  { name: "JavaScript", category: "frontend", iconName: "SiJavascript", hoverGlow: "hover:shadow-[0_0_15px_rgba(247,223,30,0.15)] hover:border-[#F7DF1E]/40" },
  { name: "Tailwind CSS", category: "frontend", iconName: "SiTailwindcss", hoverGlow: "hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:border-[#06B6D4]/40" },
  { name: "shadcn", category: "frontend", iconName: "SiShadcnui", hoverGlow: "hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:border-neutral-450 dark:hover:border-neutral-600" },
  { name: "HTML5", category: "frontend", iconName: "SiHtml5", hoverGlow: "hover:shadow-[0_0_15px_rgba(227,79,38,0.15)] hover:border-[#E34F26]/40" },
  { name: "CSS3", category: "frontend", iconName: "SiCss3", hoverGlow: "hover:shadow-[0_0_15px_rgba(21,114,182,0.15)] hover:border-[#1572B6]/40" },
  { name: "Bootstrap 4/5", category: "frontend", iconName: "SiBootstrap", hoverGlow: "hover:shadow-[0_0_15px_rgba(121,82,179,0.15)] hover:border-[#7952B3]/40" },

  // Backend
  { name: "Node.js (Fam.)", category: "backend", iconName: "SiNodedotjs", hoverGlow: "hover:shadow-[0_0_15px_rgba(51,153,51,0.15)] hover:border-[#339933]/40" },
  { name: "Strapi CMS", category: "backend", iconName: "SiStrapi", hoverGlow: "hover:shadow-[0_0_15px_rgba(73,69,255,0.15)] hover:border-[#4945FF]/40" },
  { name: "WebSockets", category: "backend", iconName: "SiSocketdotio", hoverGlow: "hover:shadow-[0_0_15px_rgba(37,99,235,0.15)] hover:border-[#2563EB]/40" },
  { name: "Express.js", category: "backend", iconName: "SiExpress", hoverGlow: "hover:shadow-[0_0_15px_rgba(100,100,100,0.15)] hover:border-neutral-500" },
  { name: "REST APIs", category: "backend", iconName: "TbApi", hoverGlow: "hover:shadow-[0_0_15px_rgba(225,29,72,0.15)] hover:border-[#E11D48]/40" },

  // Databases
  { name: "MongoDB", category: "databases", iconName: "SiMongodb", hoverGlow: "hover:shadow-[0_0_15px_rgba(71,162,72,0.15)] hover:border-[#47A248]/40" },
  { name: "MySQL", category: "databases", iconName: "SiMysql", hoverGlow: "hover:shadow-[0_0_15px_rgba(0,117,143,0.15)] hover:border-[#00758F]/40" },
  { name: "Redis", category: "databases", iconName: "SiRedis", hoverGlow: "hover:shadow-[0_0_15px_rgba(220,56,45,0.15)] hover:border-[#DC382D]/40" },

  // Tools
  { name: "Git", category: "tools", iconName: "SiGit", hoverGlow: "hover:shadow-[0_0_15px_rgba(240,80,50,0.15)] hover:border-[#F05032]/40" },
  { name: "GitHub", category: "tools", iconName: "SiGithub", hoverGlow: "hover:shadow-[0_0_15px_rgba(255,255,255,0.25)] hover:border-neutral-500" },
  { name: "Postman", category: "tools", iconName: "SiPostman", hoverGlow: "hover:shadow-[0_0_15px_rgba(255,108,55,0.15)] hover:border-[#FF6C37]/40" },
  { name: "Thunder Client", category: "tools", iconName: "TbBolt", hoverGlow: "hover:shadow-[0_0_15px_rgba(124,58,237,0.15)] hover:border-[#7C3AED]/40" },
  { name: "Vite", category: "tools", iconName: "SiVite", hoverGlow: "hover:shadow-[0_0_15px_rgba(189,52,254,0.15)] hover:border-[#BD34FE]/40" },
];

export const TechStackSection = () => {
  const [skills, setSkills] = useState<TechSkill[]>(TECH_SKILLS);
  const [activeCategory, setActiveCategory] = useState<"all" | "frontend" | "backend" | "databases" | "tools">("all");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const categories = [
    { id: "all", name: "All Stack" },
    { id: "frontend", name: "Frontend" },
    { id: "backend", name: "Backend" },
    { id: "databases", name: "Databases" },
    { id: "tools", name: "Workspace Tools" },
  ] as const;

  useEffect(() => {
    fetch(`${API_BASE}/tech`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSkills(data);
        }
      })
      .catch((err) => console.error("Failed to fetch tech skills:", err));
  }, []);

  const filteredSkills = activeCategory === "all"
    ? skills
    : skills.filter(skill => skill.category === activeCategory);

  return (
    <section id="tech-stack" className="py-16 relative transition-colors duration-300">

      {/* Subtle background ambient highlights */}
      <div className="  absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[25vw] rounded-full bg-violet-500/5 dark:bg-violet-900/5 blur-[120px] pointer-events-none" />

      <div className="  max-w-7xl mx-auto px-6 md:px-12 relative z-10">

        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-5 space-y-3">
           
            <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-white tracking-tight">
              Technical Expertise
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-xs md:text-sm leading-relaxed">
              A clean and minimal index of languages, frameworks, databases, and development tools in my workspace.
            </p>
          </div>
        </ScrollReveal>

        {/* Top minimal filter tabs */}
        <ScrollReveal y={20} delay={0.05}>
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all duration-300 ${activeCategory === cat.id
                    ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-black dark:border-white shadow-sm"
                    : "bg-white/80 dark:bg-neutral-900/30 border-neutral-200 dark:border-neutral-850 text-neutral-500 dark:text-neutral-400 hover:text-neutral-850 dark:hover:text-neutral-200"
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Compact grid of skills */}
        <ScrollReveal y={30} delay={0.1} scale={0.98}>
          <motion.div
            layout
            className="flex flex-wrap justify-center gap-2 md:gap-3.5 max-w-7xl mx-auto min-h-[140px] max-h-[260px] overflow-y-auto thin-scrollbar md:max-h-none md:overflow-visible py-2 px-1"
          >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                key={skill.name}
                className="relative block"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <AnimatePresence>
                  {hoveredIndex === index && (
                    <motion.span
                      className="absolute inset-0 h-full w-full bg-violet-500/10 dark:bg-violet-500/20 block rounded-xl"
                      layoutId="hoverBackgroundTech"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1,
                        transition: { duration: 0.15 },
                      }}
                      exit={{
                        opacity: 0,
                        transition: { duration: 0.15, delay: 0.2 },
                      }}
                    />
                  )}
                </AnimatePresence>
                <div
                  className={`group flex items-center gap-1.5 md:gap-2.5 px-2.5 py-1.5 md:px-4 md:py-2 rounded-xl border border-neutral-200/60 dark:border-white/5 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-sm hover:border-neutral-300 dark:hover:border-neutral-800 transition-all duration-300 relative z-10 cursor-pointer ${skill.hoverGlow}`}
                >
                  {/* SVG Icon with desaturation filter */}
                  <div className="w-4 h-4 md:w-5 md:h-5 flex items-center justify-center filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
                    {getTechIcon(skill.iconName, 16)}
                  </div>
                  {/* Label */}
                  <span className="text-[10px] md:text-xs font-bold text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-850 dark:group-hover:text-white transition-colors tracking-wide">
                    {skill.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        </ScrollReveal>

      </div>
    </section>
  );
};
