import { useState, useEffect, useRef, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Search } from "lucide-react";
import { projects, relationCategories } from "../data/projects";
import type { Project } from "../data/projects";
import { ProjectCarousel } from "./ProjectsSection";
import { useOutsideClick } from "../hooks/use-outside-click";

interface AllProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectsList?: Project[];
}

const GithubIcon = ({ size = 14, className }: { size?: number; className?: string }) => (
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

export const AllProjectsModal = ({ isOpen, onClose, projectsList }: AllProjectsModalProps) => {
  const [activeRelation, setActiveRelation] = useState<"All" | Project["relationCategory"]>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [hovered, setHovered] = useState<string | null>(null);
  const [active, setActive] = useState<Project | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const detailsId = useId();

  // Close on outside click
  useOutsideClick(ref, () => setActive(null));

  // Handle escape key to close details, or close main modal
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (active) {
          setActive(null);
        } else {
          onClose();
        }
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", onKeyDown);
    }
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, active, onClose]);

  // Prevent scrolling on body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Reset active project when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setActive(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const displayProjects = projectsList || projects;

  const filteredProjects = displayProjects.filter((p) => {
    const matchesRelation = activeRelation === "All" || p.relationCategory === activeRelation;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      p.title.toLowerCase().includes(searchLower) ||
      p.tags.some(tag => tag.toLowerCase().includes(searchLower));

    return matchesRelation && matchesSearch;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col bg-black/90 backdrop-blur-xl overflow-y-auto cursor-default"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-6 md:px-12 bg-black/80 backdrop-blur-md border-b border-white/10">
            <h2 className="text-xl md:text-2xl font-bold text-white">All Projects</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-12 space-y-8">

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Search */}
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <input
                  type="text"
                  placeholder="Search projects or technologies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all cursor-text"
                />
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {relationCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveRelation(cat as "All" | Project["relationCategory"])}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${activeRelation === cat
                        ? "bg-white text-black"
                        : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project) => (
                  <motion.div
                    layoutId={`card-${project.title}-${detailsId}`}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    key={project.title}
                    onClick={() => setActive(project)}
                    onMouseEnter={() => setHovered(project.title)}
                    onMouseLeave={() => setHovered(null)}
                    className={`relative flex flex-col p-5 rounded-3xl bg-white/[0.04] border border-white/[0.08] hover:border-violet-500/50 hover:shadow-[0_20px_50px_rgba(139,92,246,0.15)] transition-all duration-500 group overflow-hidden cursor-pointer ${
                      hovered !== null && hovered !== project.title
                        ? "blur-[2px] scale-[0.98] opacity-50"
                        : "opacity-100 scale-100"
                    }`}
                  >
                    {/* Subtle Glow Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 via-fuchsia-500/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-violet-500/15 dark:bg-violet-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    {/* Project Image Preview in Archive Modal */}
                    <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-white/[0.04] bg-black/40 mb-3 shadow-[inset_0_0_20px_rgba(0,0,0,0.2)]">
                      {/* Floating Badges */}
                      <div className="absolute top-2.5 left-2.5 z-10 flex gap-1.5 pointer-events-none">
                        <span className="text-[9px] px-2.5 py-0.5 rounded-lg bg-black/80 text-violet-400 border border-violet-500/20 backdrop-blur-md font-bold uppercase tracking-wider">
                          {project.techCategory}
                        </span>
                      </div>
                      <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none">
                        <span className="text-[9px] px-2.5 py-0.5 rounded-lg bg-black/80 text-neutral-350 border border-white/10 backdrop-blur-md font-bold uppercase tracking-wider">
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
                          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/50 via-transparent to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-500" />
                        </>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-black flex items-center justify-center relative">
                          <span className="text-[9px] font-mono text-neutral-600 font-semibold tracking-widest uppercase">No Preview</span>
                          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(139,92,246,0.1),transparent_100%)]" />
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-start mb-2.5 gap-4">
                      <div className="space-y-1 flex-1">
                        <span className="text-[8px] font-mono uppercase tracking-widest text-violet-400 font-bold block mb-1">
                          {project.role}
                        </span>
                        <h3 className="text-base font-extrabold text-white group-hover:text-violet-300 transition-colors duration-300 leading-snug line-clamp-1">
                          {project.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-white/40 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-white/5"
                          >
                            <GithubIcon size={16} />
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-white/40 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-white/5"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-white/60 leading-relaxed mb-4 flex-grow line-clamp-2">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {project.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="text-[9px] px-2.5 py-1 rounded-lg bg-black/55 border border-white/[0.06] text-white/80 font-medium tracking-wide"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="text-[9px] px-2.5 py-1 rounded-lg bg-black/55 border border-white/[0.06] text-white/40 font-medium">
                          +{project.tags.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Bottom CTA divider & animated hint */}
                    <div className="w-full pt-3 mt-4 border-t border-white/[0.05] flex items-center justify-between text-[10px] font-bold text-white/40 group-hover:text-violet-400 transition-all duration-300">
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
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-20 text-white/40">
                No projects found matching your search.
              </div>
            )}

          </div>

        </motion.div>
      )}

      {/* Expanded Card Overlay (Rendered outside of the transformed scrollable motion.div modal body) */}
      <AnimatePresence>
        {active && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActive(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] cursor-pointer"
            />

            {/* Expanded Card */}
            <div className="fixed inset-0 grid place-items-center z-[120] p-4 cursor-default">
              <motion.button
                key={`close-btn-${active.title}-${detailsId}`}
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
                layoutId={`card-${active.title}-${detailsId}`}
                ref={ref}
                className="w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 cursor-default text-neutral-900 dark:text-neutral-100"
              >
                {/* Banner Carousel */}
                <div className="relative aspect-video w-full border-b border-neutral-200 dark:border-neutral-800 bg-neutral-105 dark:bg-neutral-950 overflow-hidden">
                  {active.images && active.images.length > 0 ? (
                    <ProjectCarousel images={active.images} />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-neutral-850 to-neutral-950 flex items-center justify-center relative">
                      <span className="text-[9px] font-mono text-neutral-500 font-semibold tracking-widest uppercase">Project Preview</span>
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(139,92,246,0.1),transparent_100%)]" />
                    </div>
                  )}
                </div>

                {/* Expanded Header Bar */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <motion.span
                          layoutId={`role-${active.title}-${detailsId}`}
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
                        layoutId={`title-${active.title}-${detailsId}`}
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
                    className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto pr-2 thin-scrollbar text-left"
                  >
                    {active.detailedDescription}
                  </motion.p>

                  {/* Category Badges */}
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] px-2.5 py-1 rounded-md bg-violet-50 dark:bg-violet-950/40 border border-violet-200/50 dark:border-violet-800/40 text-violet-700 dark:text-violet-300 font-bold uppercase tracking-wider">
                      {active.techCategory}
                    </span>
                    <span className="text-[9px] px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-700/40 text-neutral-650 dark:text-neutral-300 font-bold uppercase tracking-wider">
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
                    {active.githubUrl && (
                      <a
                        href={active.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
                      >
                        <GithubIcon size={14} />
                        <span>Source Code</span>
                      </a>
                    )}
                    {active.liveUrl && (
                      <a
                        href={active.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                      >
                        <ExternalLink size={14} />
                        <span>Live Site</span>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
};
