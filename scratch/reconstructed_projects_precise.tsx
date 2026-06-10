
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import { useOutsideClick } from "../hooks/use-outside-click";

import { projects, techCategories, relationCategories } from "../data/projects";
import type { Project, TechCategory, RelationCategory } from "../data/projects";
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

/* ─── Expandable Card Component ──────────────────────────────────── 

export const ProjectsSection = () => {
  const [active, setActive] = useState<Project | null>(null);
  const [activeTech, setActiveTech] = useState<"All" | TechCategory>("All");
  const [activeRelation, setActiveRelation] = useState<
    "All" | RelationCategory
  >("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

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
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  // Close on outside click
  useOutsideClick(ref, () => setActive(null));

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    const techMatch = activeTech === "All" || p.techCategory === activeTech;
    const relMatch =
      activeRelation === "All" || p.relationCategory === activeRelation;
    return techMatch && relMatch;
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
        <div className="text-center max-w-xl mx-auto mb-10 space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-violet-600 dark:text-violet-400 text-xs font-semibold uppercase tracking-widest"
          >
            Works
          </motion.div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
            Engineering Highlights
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-xs md:text-sm leading-relaxed">
            A minimal log of software systems and platforms built for active
            corporate clients.
          </p>
        </div>

        {/* ─── Filter Tabs ────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          {/* Tech Category Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800">
            {techCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTech(cat)}
                className={`relative px-3.5 py-1.5 text-[11px] font-semibold rounded-lg transition-all duration-200 ${activeTech === cat
                    ? "text-white"
                    : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                  }`}
              >
                {activeTech === cat && (
                  <motion.div
                    layoutId="techTab"
                    className="absolute inset-0 bg-violet-600 dark:bg-violet-500 rounded-lg"
                    transition={{
                      type: "spring",
                      bounce: 0.2,
                      duration: 0.5,
                    }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            ))}
          </div>

          {/* Separator */}
          <div className="hidden sm:block w-px h-6 bg-neutral-300 dark:bg-neutral-700" />

          {/* Relation Category Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800">
            {relationCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveRelation(cat)}
                className={`relative px-3.5 py-1.5 text-[11px] font-semibold rounded-lg transition-all duration-200 ${activeRelation === cat
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
                  className={`relative z-10 ${activeRelation === cat
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
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
              />

              {/* Expanded Card */}
              <div className="fixed inset-0 grid place-items-center z-[110] p-4">
                <motion.button
                  key={`close-btn-${active.title}-${id}`}
         











                <motion.div
                  layoutId={`card-${active.title}-${id}`}
                  ref={ref}
                  className="w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800"
                >
                  {/* Expanded Header Bar */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <motion.span
                            layoutId={`role-${active.title}-${id}`}
                            className="text-[9px] font-mono uppercase tracking-widest text-violet-600 dark:text-violet-400 font-bold"
                          >
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
                        className="hidden lg:flex items-center justify-center rounded-full h-8 w-8 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
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
                      className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed"
                    >
                      {active.detailedDescription}
                    </motion.p>

                    {/* Category Badges */}
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] px-2.5 py-1 rounded-md bg-violet-50 dark:bg-violet-950/40 border border-violet-200/50 dark:border-violet-800/40 text-violet-700 dark:text-violet-300 font-bold uppercase tracking-wider">
                        {active.techCategory}
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
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold hover:opacity-90 transition-opacity"
                      >
                        <GithubIcon size={14} />
                        <span>Source Code</span>
                      </a>
                      <a
                        href={active.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
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
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <mot
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
                className="group relative rounded-2xl border border-neutral-200 dark:border-white/5 bg-neutral-50/50 dark:bg-neutral-900/10 backdrop-blur-md p-4 hover:border-violet-500/20 hover:shadow-[0_12px_30px_rgba(139,92,246,0.04)] hover:-translate-y-1 transition-all duration-300 cursor-pointer text-left flex flex-col justify-between"

                <div className="relative z-10 space-y-3 text-left">
                  {/* Header: Role + Category badge */}
                  <div className="flex items-center justify-between">
                    <motion.span
                      layoutId={`role-${project.title}-${id}`}
                      className="text-[9px] font-mono uppercase tracking-widest text-violet-600 dark:text-violet-400 font-bold"
                    >
                      {project.role}
                    </motion.span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 font-bold uppercase tracking-wider">
                        {project.techCategory}
                      </span>
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-neutral-200/60 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider">
                        {project.relationCategory}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <motion.h3
                    layoutId={`title-${project.title}-${id}`}
                    className="text-base font-extrabold text-neutral-850 dark:text-neutral-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors"
                  >
                    {project.title}
                  </motion.h3>

                  {/* Short description */}
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tech Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 3).map((tag, tagIdx) => (
                      <span
                        key={tagIdx}
                        className="text-[9px] px-2 py-0.5 rounded bg-neutral-200/50 dark:bg-neutral-950/60 border border-neutral-300/40 dark:border-neutral-900 text-neutral-500 dark:text-neutral-400 font-semibold tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="text-[9px] px-2 py-0.5 rounded bg-neutral-200/50 dark:bg-neutral-950/60 border border-neutral-300/40 dark:border-neutral-900 text-neutral-400 dark:text-neutral-500 font-semibold">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* CTA hint */}
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-violet-500 dark:text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pt-1">
                    <span>Click to expand</span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7 17l9.2-9.2M17 17V7H7" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

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

      <AllProjectsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};
























































































































































































































































































































































































































































































































































































{"step_index":1010,"source":"MODEL","type":"PLANNER_RESPONSE","status":"DONE","created_at":"2026-06-04T12:36:17Z","tool_calls":[{"name":"grep_search","args":{"MatchPerLine":"true","Query":"\"mx-auto\"","SearchPath":"\"d:\\\\aiagent\\\\testing\\\\src\\\\components\\\\ProjectsSection.tsx\"","toolAction":"\"Finding mx-auto in ProjectsSection\"","toolSummary":"\"Grep search\""}}]}
{"step_index":1011,"source":"MODEL","type":"GREP_SEARCH","status":"DONE","created_at":"2026-06-04T12:36:23Z","content":"Created At: 2026-06-04T12:36:23Z\nCompleted At: 2026-06-04T12:36:23Z\nNo results found"}
{"step_index":1012,"source":"MODEL","type":"PLANNER_RESPONSE","status":"DONE","created_at":"2026-06-04T12:36:23Z","tool_calls":[{"name":"view_file","args":{"AbsolutePath":"\"d:\\\\aiagent\\\\testing\\\\src\\\\components\\\\ProjectsSection.tsx\"","EndLine":"100","StartLine":"1","toolAction":"\"Viewing ProjectsSection file from start\"","toolSummary":"\"View file\""}}]}
{"step_index":1013,"source":"MODEL","type":"VIEW_FILE","status":"DONE","created_at":"2026-06-04T12:36:28Z","content":"Created At: 2026-06-04T12:36:28Z\nCompleted At: 2026-06-04T12:36:29Z\nFile Path: `file:///d:/aiagent/testing/src/components/ProjectsSection.tsx`\nTotal Lines: 432\nTotal Bytes: 19950\nShowing lines 1 to 100\nThe following code has been modified to include a line number before every line, in the format: <line_number>: <original_line>. Please note that any changes targeting the original code should remove the line number, col