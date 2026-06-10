import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Search } from "lucide-react";
import { projects, relationCategories } from "../data/projects";
import type { Project } from "../data/projects";

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
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    key={project.title}
                    onMouseEnter={() => setHovered(project.title)}
                    onMouseLeave={() => setHovered(null)}
                    className={`relative flex flex-col p-5 rounded-3xl bg-white/[0.04] border border-white/[0.08] hover:border-violet-500/50 hover:shadow-[0_20px_50px_rgba(139,92,246,0.15)] transition-all duration-500 group overflow-hidden ${
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
                        <span className="text-[9px] px-2.5 py-0.5 rounded-lg bg-black/80 text-neutral-300 border border-white/10 backdrop-blur-md font-bold uppercase tracking-wider">
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
    </AnimatePresence>
  );
};
