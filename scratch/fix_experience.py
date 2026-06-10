import os

code = """import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Calendar, ChevronRight } from "lucide-react";

export const ExperienceSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const experiences = [
    {
      title: "Mar 2024 - Present",
      role: "Team Lead - Front-End",
      company: "Codeverse IT",
      companyFull: "Codeverse IT Pvt Ltd",
      color: "text-purple-400",
      borderColor: "border-purple-500/20",
      glowColor: "shadow-[0_0_15px_rgba(168,85,247,0.15)]",
      points: [
        "<strong>Team Leadership:</strong> Led frontend development, defined architecture, and directly communicated with international clients to translate requirements into products.",
        "<strong>Real-Time Systems:</strong> Built scalable SocketIO & Redis chat/gaming platforms supporting 200,000+ users, cutting system latency by 35%.",
        "<strong>Complex UI/UX:</strong> Developed a high-traffic taxi booking portal with live driver tracking and route optimization.",
        "<strong>Optimization:</strong> Streamlined MongoDB queries and integrated robust REST APIs for seamless data synchronization."
      ],
      skills: ["HTML/CSS", "Node.js", "Git", "MongoDB", "CSS3", "Redis", "React", "JavaScript", "Redux", "Redux Form", "Redux-Saga", "Next.js", "Redux Toolkit", "Express.js", "AWS"]
    },
    {
      title: "Jan 2022 - Mar 2024",
      role: "Front-End Developer",
      company: "O2 Technology",
      companyFull: "O2 Technology",
      color: "text-blue-400",
      borderColor: "border-blue-500/20",
      glowColor: "shadow-[0_0_15px_rgba(59,130,246,0.15)]",
      points: [
        "<strong>Trading Platforms:</strong> Engineered high-performance UIs integrating 5+ broker APIs (Zerodha, Alice Blue) and WebSockets for live, millisecond-level option chain data feeds.",
        "<strong>Copy Trading System:</strong> Developed a synchronized portal and automated strategy panels for client portfolios.",
        "<strong>Performance Tuning:</strong> Optimized DOM rendering logic and memory management for massive, rapidly changing real-time data grids."
      ],
      skills: ["React-JS", "Redux", "WebSockets", "REST APIs", "TypeScript", "Tailwind CSS", "Bootstrap", "HTML5", "CSS3", "Vite"]
    },
    {
      title: "Jun 2019 - Dec 2021",
      role: "Front-End Developer",
      company: "P&P Infotech",
      companyFull: "P&P Infotech",
      color: "text-emerald-400",
      borderColor: "border-emerald-500/20",
      glowColor: "shadow-[0_0_15px_rgba(16,185,129,0.15)]",
      points: [
        "<strong>Product Delivery:</strong> Built and delivered highly responsive web applications using React-JS, Redux, and modern CSS frameworks.",
        "<strong>API Integration:</strong> Collaborated with backend teams to seamlessly consume secure REST APIs and manage client-side state.",
        "<strong>Cross-Browser Support:</strong> Ensured robust compatibility, performance optimization, and accessible markup across diverse desktop and mobile browsers."
      ],
      skills: ["React-JS", "Redux", "JavaScript", "Bootstrap", "HTML5", "CSS3", "Git", "REST APIs", "Responsive Design"]
    }
  ];

  return (
    <section id="experience" className="py-20 relative overflow-hidden transition-colors duration-300">
      {/* Background ambient highlights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[30vw] rounded-full bg-violet-500/[0.02] dark:bg-violet-900/[0.03] blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="text-violet-600 dark:text-violet-400 text-xs font-semibold uppercase tracking-widest mb-2">
            Milestones
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-white tracking-tight">
            Work Experience
          </h2>
          <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-400 mt-3 max-w-xl mx-auto leading-relaxed">
            A look at my professional journey and the organizations where I have driven frontend excellence.
          </p>
        </div>

        {/* Tabbed Layout Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mt-8">
          
          {/* Tabs Menu Column */}
          <div className="lg:col-span-4 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0 gap-2 scrollbar-none border-b lg:border-b-0 lg:border-l border-neutral-200 dark:border-neutral-800">
            {experiences.map((exp, index) => (
              <button
                key={exp.company}
                onClick={() => setActiveIndex(index)}
                className={`flex-none text-left px-5 py-3.5 rounded-xl lg:rounded-none lg:rounded-r-xl border lg:border-l-2 lg:border-y-0 lg:border-r-0 transition-all duration-300 ${
                  activeIndex === index
                    ? "bg-violet-500/[0.06] dark:bg-violet-500/[0.04] border-violet-500/80 text-violet-600 dark:text-violet-400 font-semibold"
                    : "border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100/50 dark:hover:bg-neutral-900/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="block text-sm">{exp.company}</span>
                    <span className="block text-[10px] opacity-70 font-normal tracking-wide mt-0.5">
                      {exp.title}
                    </span>
                  </div>
                  <ChevronRight size={14} className={`hidden lg:block transition-transform duration-300 ${activeIndex === index ? "translate-x-1 opacity-100" : "opacity-0"}`} />
                </div>
              </button>
            ))}
          </div>

          {/* Active Content Display Column */}
          <div className="lg:col-span-8 min-h-[380px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className={`p-6 md:p-8 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 bg-white/40 dark:bg-neutral-950/40 backdrop-blur-sm shadow-xl shadow-neutral-200/5 dark:shadow-neutral-950/20`}
              >
                {/* Header info */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-900 pb-5 mb-5">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-11 h-11 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-400`}>
                      <Briefcase size={18} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-neutral-800 dark:text-white tracking-tight">
                        {experiences[activeIndex].role}
                      </h3>
                      <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mt-0.5">
                        {experiences[activeIndex].companyFull}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900 px-3.5 py-2 rounded-xl self-start md:self-center border border-neutral-200/60 dark:border-neutral-800/60">
                    <Calendar size={13} className="text-violet-500" />
                    <span>{experiences[activeIndex].title}</span>
                  </div>
                </div>

                {/* Bullets List */}
                <ul className="space-y-3.5 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6 pl-1.5">
                  {experiences[activeIndex].points.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
                      <span dangerouslySetInnerHTML={{ __html: pt }} />
                    </li>
                  ))}
                </ul>

                {/* Skills Badges */}
                <div className="border-t border-neutral-200 dark:border-neutral-900 pt-5">
                  <p className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 dark:text-neutral-500 mb-3 pl-0.5">
                    Skills Utilized
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {experiences[activeIndex].skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs px-3 py-1 rounded-xl bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 font-medium hover:border-violet-500/30 dark:hover:border-violet-500/20 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
      
      {/* Hide horizontal scrollbar style */}
      <style>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};
"""

target_path = r"d:\aiagent\testing\src\components\ExperienceSection.tsx"
with open(target_path, "w", encoding="utf-8") as f:
    f.write(code)
print("ExperienceSection successfully written via Python!")
