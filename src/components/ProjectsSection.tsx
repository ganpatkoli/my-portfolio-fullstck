import { useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import { useOutsideClick } from "../hooks/use-outside-click";
import { ScrollReveal } from "./ui/scroll-reveal";
import { API_BASE } from "../lib/api";

import { projects, relationCategories } from "../data/projects";
import type { Project, RelationCategory } from "../data/projects";
import { AllProjectsModal } from "./AllProjectsModal";
import { HoverBorderGradient } from "./ui/hover-border-gradient";

/* ─── Github Icon ────────────────────────────────────────────────── */

const GithubIcon = ({
  size = 14,
  className,
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const ProjectCarousel = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images || images.length === 0) return null;

  if (images.length === 1) {
    return (
      <img
        src={images[0]}
        alt="project screen"
        className="w-full h-full object-cover"
      />
    );
  }

  return (
    <div className="relative w-full h-full group/carousel">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`project screen ${currentIndex + 1}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Nav Controls */}
      <button
        type="button"
        onClick={prevSlide}
        className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white border border-white/10 transition-colors opacity-0 group-hover/carousel:opacity-100 duration-200 cursor-pointer"
      >
        ←
      </button>
      <button
        type="button"
        onClick={nextSlide}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white border border-white/10 transition-colors opacity-0 group-hover/carousel:opacity-100 duration-200 cursor-pointer"
      >
        →
      </button>

      {/* Indicator Dots */}
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {images.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(idx);
            }}
            className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
              currentIndex === idx ? "bg-white w-3.5" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export const ProjectsSection = () => {
  const [projectList, setProjectList] = useState<Project[]>(projects);
  const [active, setActive] = useState<Project | null>(null);
  const [activeRelation, setActiveRelation] = useState<
    "All" | RelationCategory
  >("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    fetch(`${API_BASE}/projects`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProjectList(data);
        }
      })
      .catch((err) => console.error("Failed to fetch projects:", err));
  }, []);

  // Close on Escape
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }

    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  // Close on outside click
  useOutsideClick(ref, () => setActive(null));

  // Filter projects
  const filteredProjects = projectList.filter((p) => {
    return activeRelation === "All" || p.relationCategory === activeRelation;
  }).slice(0, 4); // Only show top 4 featured projects

  return (
    <section
      id="projects"
      className="py-16 relative transition-colors duration-300"
    >
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[30vw] rounded-full bg-violet-500/5 dark:bg-violet-900/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* ─── Section Header ─────────────────────────────────── */}
        <ScrollReveal>
          <div className="text-center max-w-xl mx-auto mb-10 space-y-3">
            <div className="text-violet-600 dark:text-violet-400 text-xs font-semibold uppercase tracking-widest">
              Works
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-white tracking-tight">
              Projects
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-xs md:text-sm leading-relaxed">
              A minimal log of software systems and platforms built for active corporate clients.
            </p>
          </div>
        </ScrollReveal>

        {/* ─── Filter Tabs ────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          {/* Relation Category Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800">
            {relationCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveRelation(cat)}
                className={`relative px-3.5 py-1.5 text-[11px] font-semibold rounded-lg transition-all duration-200 ${
                  activeRelation === cat
                    ? "text-white"
                    : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                }`}
              >
                {activeRelation === cat && (
                  <motion.div
                    layoutId="relationTab"
                    className="absolute inset-0 bg-neutral-800 dark:bg-neutral-200 rounded-lg"
                    transition={{
                      type: "spring",
                      bounce: 0.2,
                      duration: 0.5,
                    }}
                  />
                )}
                <span
                  className={`relative z-10 ${
                    activeRelation === cat
                      ? "text-white dark:text-neutral-900"
                      : ""
                  }`}
                >
                  {cat}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ─── Expanded Card Overlay ──────────────────────────── */}
        <AnimatePresence>
          {active && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] cursor-pointer"
              />

              {/* Expanded Card */}
              <div className="fixed inset-0 grid place-items-center z-[110] p-4 cursor-default">
                <motion.button
                  key={`close-btn-${active.title}-${id}`}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-2 right-2 flex lg:hidden items-center justify-center rounded-full h-8 w-8 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 cursor-pointer"
                  onClick={() => setActive(null)}
                >
                  <X size={14} />
                </motion.button>

                <motion.div
                  layoutId={`card-${active.title}-${id}`}
                  ref={ref}
                  className="w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 cursor-default"
                >
                  {/* Banner Carousel */}
                  {active.images && active.images.length > 0 && (
                    <div className="relative aspect-video w-full border-b border-neutral-200 dark:border-neutral-800 bg-neutral-105 dark:bg-neutral-950 overflow-hidden">
                      <ProjectCarousel images={active.images} />
                    </div>
                  )}

                  {/* Expanded Header Bar */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <motion.span
                            layoutId={`role-${active.title}-${id}`}
                            className="text-[9px] font-mono uppercase tracking-widest text-violet-600 dark:text-violet-400 font-bold"
                          >
                            {active.role}
                          </motion.span>
                          {active.client && (
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 font-semibold">
                              {active.client}
                            </span>
                          )}
                        </div>
                        <motion.h3
                          layoutId={`title-${active.title}-${id}`}
                          className="text-lg font-extrabold text-neutral-900 dark:text-neutral-100"
                        >
                          {active.title}
                        </motion.h3>
                      </div>

                      {/* Desktop close */}
                      <button
                        onClick={() => setActive(null)}
                        className="hidden lg:flex items-center justify-center rounded-full h-8 w-8 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <div className="px-6 pb-6 space-y-5">
                    {/* Detailed Description */}
                    <motion.p
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-wrap"
                    >
                      {active.detailedDescription}
                    </motion.p>

                    {/* Category Badges */}
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] px-2.5 py-1 rounded-md bg-violet-50 dark:bg-violet-950/40 border border-violet-200/50 dark:border-violet-800/40 text-violet-700 dark:text-violet-300 font-bold uppercase tracking-wider">
                        {active.techCategory}
                      </span>
                      <span className="text-[9px] px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-700/40 text-neutral-600 dark:text-neutral-300 font-bold uppercase tracking-wider">
                        {active.relationCategory}
                      </span>
                    </div>

                    {/* Tech Stack Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {active.tags.map((tag, tagIdx) => (
                        <span
                          key={tagIdx}
                          className="text-[10px] px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 font-semibold tracking-wide"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Links */}
                    <div className="flex items-center gap-3 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                      <a
                        href={active.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
                      >
                        <GithubIcon size={14} />
                        <span>Source Code</span>
                      </a>
                      <a
                        href={active.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                      >
                        <ExternalLink size={14} />
                        <span>Live Site</span>
                      </a>
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>

        {/* ─── Cards Grid ─────────────────────────────────────── */}
        <ScrollReveal y={50} scale={0.97}>
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.title}
                  layoutId={`card-${project.title}-${id}`}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, type: "spring", bounce: 0.15 }}
                  onClick={() => setActive(project)}
                  className="group relative rounded-3xl border border-neutral-200/80 dark:border-white/[0.08] bg-white/90 dark:bg-neutral-900/60 backdrop-blur-xl p-5 hover:border-violet-500/50 hover:shadow-[0_20px_50px_rgba(139,92,246,0.15)] hover:-translate-y-2 transition-all duration-500 cursor-pointer text-left flex flex-col justify-between overflow-hidden"
                >
                  {/* Subtle Glow Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 via-fuchsia-500/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-violet-500/15 dark:bg-violet-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="relative z-10 flex flex-col h-full justify-between w-full">
                    <div className="space-y-3.5 text-left w-full">
                      {/* Project Image Preview Card Header */}
                      <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-neutral-200/40 dark:border-white/[0.04] bg-neutral-100 dark:bg-neutral-950/50 mb-3 shadow-[inset_0_0_20px_rgba(0,0,0,0.05)]">
                        {/* Floating Badges */}
                        <div className="absolute top-2.5 left-2.5 z-10 flex gap-1.5 pointer-events-none">
                          <span className="text-[9px] px-2.5 py-0.5 rounded-lg bg-neutral-900/85 dark:bg-black/75 text-violet-400 border border-violet-500/20 backdrop-blur-md font-bold uppercase tracking-wider">
                            {project.techCategory}
                          </span>
                        </div>
                        <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none">
                          <span className="text-[9px] px-2.5 py-0.5 rounded-lg bg-neutral-900/85 dark:bg-black/75 text-neutral-300 border border-white/10 backdrop-blur-md font-bold uppercase tracking-wider">
                            {project.relationCategory}
                          </span>
                        </div>

                        {project.images && project.images.length > 0 ? (
                          <>
                            <img
                              src={project.images[0]}
                              alt={project.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-500" />
                          </>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-neutral-850 to-neutral-950 flex items-center justify-center relative">
                            <span className="text-[9px] font-mono text-neutral-600 font-semibold tracking-widest uppercase">No Preview</span>
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(139,92,246,0.1),transparent_100%)]" />
                          </div>
                        )}
                      </div>

                      {/* Role */}
                      <div className="space-y-1">
                        <motion.span
                          layoutId={`role-${project.title}-${id}`}
                          className="text-[8px] font-mono uppercase tracking-widest text-violet-600 dark:text-violet-400 font-bold block"
                        >
                          {project.role}
                        </motion.span>
    
                        {/* Title */}
                        <motion.h3
                          layoutId={`title-${project.title}-${id}`}
                          className="text-base font-extrabold text-neutral-900 dark:text-neutral-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-300 line-clamp-1 leading-snug"
                        >
                          {project.title}
                        </motion.h3>
                      </div>
    
                      {/* Short description */}
                      <p className="text-xs text-neutral-650 dark:text-neutral-300 leading-relaxed font-normal line-clamp-2">
                        {project.description}
                      </p>
    
                      {/* Tech Badges */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.tags.slice(0, 3).map((tag, tagIdx) => (
                          <span
                            key={tagIdx}
                            className="text-[9px] px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-white/[0.04] text-neutral-600 dark:text-neutral-300 font-medium tracking-wide"
                          >
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="text-[9px] px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-white/[0.04] text-neutral-500 dark:text-neutral-400 font-medium">
                            +{project.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom CTA divider & animated hint */}
                    <div className="w-full pt-3 mt-4 border-t border-neutral-200/60 dark:border-white/[0.05] flex items-center justify-between text-[10px] font-bold text-neutral-400 dark:text-neutral-500 group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-all duration-300">
                      <span>View Details</span>
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
                      >
                        <path d="M7 17l9.2-9.2M17 17V7H7" />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </ScrollReveal>

        {/* Empty state */}
        <AnimatePresence>
          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center py-16"
            >
              <p className="text-neutral-400 dark:text-neutral-500 text-sm">
                No projects match the selected filters.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View All Projects Button */}
        <div className="mt-16 flex justify-center">
          <HoverBorderGradient
            containerClassName="w-auto"
            className="px-8 py-3 bg-black/50 backdrop-blur-md text-white font-bold"
            onClick={() => setIsModalOpen(true)}
          >
            View All Projects
          </HoverBorderGradient>
        </div>
      </div>

      <AllProjectsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} projectsList={projectList} />
    </section>
  );
};
