import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "./ui/scroll-reveal";
import { 
  Gamepad2, 
  LayoutDashboard, 
  Handshake, 
  Smartphone, 
  TrendingUp,
  Cpu,
  RefreshCw,
  Layers
} from "lucide-react";
import { API_BASE } from "../lib/api";
import * as LucideIcons from "lucide-react";

const getIcon = (name: string): React.ReactNode => {
  const IconComponent = (LucideIcons as any)[name] || LucideIcons.Cpu;
  return React.createElement(IconComponent, { size: 24, className: "stroke-[2.5]" });
};

// ============================================================================
// DATA CONFIGURATIONS
// ============================================================================

interface ServiceCardData {
  icon: React.ReactNode;
  title: string;
  description: string;
  techs: string[];
  gradientFrom: string;
  iconBgClass: string;
  iconTextClass: string;
  iconBorderClass: string;
  accentBg: string;
  iconName?: string;
}

const serviceList: ServiceCardData[] = [
  {
    icon: <Cpu size={24} className="stroke-[2.5]" />,
    title: "SaaS Development",
    description: "Designing and building scalable multi-tenant SaaS platforms, secure subscription flows, and cloud integration architectures.",
    techs: ["React-JS", "Node.js", "Stripe API", "Cloud Solutions"],
    gradientFrom: "from-violet-500/5",
    accentBg: "bg-violet-500",
    iconBgClass: "bg-violet-50 dark:bg-violet-950/20",
    iconTextClass: "text-violet-600 dark:text-violet-400",
    iconBorderClass: "border-violet-100 dark:border-violet-500/10",
  },
  {
    icon: <Layers size={24} className="stroke-[2.5]" />,
    title: "Fullstack Development",
    description: "Engineering complete, robust web applications combining responsive client side layers with secure backend databases.",
    techs: ["React-JS", "Node.js", "MongoDB", "Express"],
    gradientFrom: "from-cyan-500/5",
    accentBg: "bg-cyan-500",
    iconBgClass: "bg-cyan-50 dark:bg-cyan-950/20",
    iconTextClass: "text-cyan-600 dark:text-cyan-400",
    iconBorderClass: "border-cyan-100 dark:border-cyan-500/10",
  },
  {
    icon: <Smartphone size={24} className="stroke-[2.5]" />,
    title: "Mobile App Development",
    description: "Building fast, high-performance cross-platform mobile apps for iOS and Android using React Native and Redux.",
    techs: ["React Native", "iOS / Android", "Redux", "Native APIs"],
    gradientFrom: "from-purple-500/5",
    accentBg: "bg-purple-500",
    iconBgClass: "bg-purple-50 dark:bg-purple-950/20",
    iconTextClass: "text-purple-600 dark:text-purple-400",
    iconBorderClass: "border-purple-100 dark:border-purple-500/10",
  },
  {
    icon: <TrendingUp size={24} className="stroke-[2.5]" />,
    title: "Website Development",
    description: "Creating lightning-fast marketing web portals with modern styling, SEO optimization, and smooth interactive animations.",
    techs: ["Next.js", "Vite", "Tailwind CSS", "Framer Motion"],
    gradientFrom: "from-blue-500/5",
    accentBg: "bg-blue-500",
    iconBgClass: "bg-blue-50 dark:bg-blue-950/20",
    iconTextClass: "text-blue-600 dark:text-blue-400",
    iconBorderClass: "border-blue-100 dark:border-blue-500/10",
  },
  {
    icon: <RefreshCw size={24} className="stroke-[2.5]" />,
    title: "DevOps & Cloud",
    description: "Automating software deployment cycles, continuous CI/CD pipelines, container clustering, and cloud configurations.",
    techs: ["Docker", "AWS / GCP", "GitHub Actions", "CI / CD"],
    gradientFrom: "from-emerald-500/5",
    accentBg: "bg-emerald-500",
    iconBgClass: "bg-emerald-50 dark:bg-emerald-950/20",
    iconTextClass: "text-emerald-600 dark:text-emerald-400",
    iconBorderClass: "border-emerald-100 dark:border-emerald-500/10",
  },
  {
    icon: <Handshake size={24} className="stroke-[2.5]" />,
    title: "CRM Systems",
    description: "Developing custom Customer Relationship Management platforms tailored to automate company sales funnels and client tracking.",
    techs: ["React", "Analytics", "Pipeline Automations", "APIs"],
    gradientFrom: "from-rose-500/5",
    accentBg: "bg-rose-500",
    iconBgClass: "bg-rose-50 dark:bg-rose-950/20",
    iconTextClass: "text-rose-600 dark:text-rose-400",
    iconBorderClass: "border-rose-100 dark:border-rose-500/10",
  },
  {
    icon: <Gamepad2 size={24} className="stroke-[2.5]" />,
    title: "Fantasy Games",
    description: "Architecting interactive draft dashboards, sports gamification logic, and real-time live score updates.",
    techs: ["React-JS", "WebSockets", "State Logic", "Real-Time Sync"],
    gradientFrom: "from-amber-500/5",
    accentBg: "bg-amber-500",
    iconBgClass: "bg-amber-50 dark:bg-amber-950/20",
    iconTextClass: "text-amber-600 dark:text-amber-400",
    iconBorderClass: "border-amber-100 dark:border-amber-500/10",
  },
  {
    icon: <LayoutDashboard size={24} className="stroke-[2.5]" />,
    title: "Admin Panels",
    description: "Designing corporate dashboards with detailed charts displays, advanced search grids, and role-based permissions.",
    techs: ["React", "Tailwind CSS", "Data Tables", "Recharts"],
    gradientFrom: "from-teal-500/5",
    accentBg: "bg-teal-500",
    iconBgClass: "bg-teal-50 dark:bg-teal-950/20",
    iconTextClass: "text-teal-600 dark:text-teal-400",
    iconBorderClass: "border-teal-100 dark:border-teal-500/10",
  },
];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

// 1. Interactive 3D Perspective Card Tilt Wrapper
export const Card3D = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const el = cardRef.current;
    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    const rY = (mouseX / (width / 2)) * 12;
    const rX = -(mouseY / (height / 2)) * 12;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: isHovered ? "none" : "transform 0.5s cubic-bezier(0.1, 0.8, 0.2, 1)",
      }}
      className={className}
    >
      {children}
    </div>
  );
};

// 2. Individual Service Card Component
const ServiceCard = ({ data }: { data: ServiceCardData }) => {
  // Convert Tailwind background class to matching hover background classes
  const getHoverBgClass = (accentBg: string) => {
    if (accentBg.includes("cyan")) return "hover:bg-cyan-600 dark:hover:bg-cyan-600/90 hover:border-cyan-500 hover:shadow-[0_15px_30px_rgba(6,182,212,0.25)]";
    if (accentBg.includes("purple")) return "hover:bg-purple-600 dark:hover:bg-purple-600/90 hover:border-purple-500 hover:shadow-[0_15px_30px_rgba(168,85,247,0.25)]";
    if (accentBg.includes("violet")) return "hover:bg-violet-600 dark:hover:bg-violet-600/90 hover:border-violet-500 hover:shadow-[0_15px_30px_rgba(139,92,246,0.25)]";
    if (accentBg.includes("blue")) return "hover:bg-blue-600 dark:hover:bg-blue-600/90 hover:border-blue-500 hover:shadow-[0_15px_30px_rgba(59,130,246,0.25)]";
    if (accentBg.includes("emerald")) return "hover:bg-emerald-600 dark:hover:bg-emerald-600/90 hover:border-emerald-500 hover:shadow-[0_15px_30px_rgba(16,185,129,0.25)]";
    if (accentBg.includes("rose")) return "hover:bg-rose-600 dark:hover:bg-rose-600/90 hover:border-rose-500 hover:shadow-[0_15px_30px_rgba(244,63,94,0.25)]";
    if (accentBg.includes("amber")) return "hover:bg-amber-600 dark:hover:bg-amber-600/90 hover:border-amber-500 hover:shadow-[0_15px_30px_rgba(245,158,11,0.25)]";
    if (accentBg.includes("teal")) return "hover:bg-teal-600 dark:hover:bg-teal-600/90 hover:border-teal-500 hover:shadow-[0_15px_30px_rgba(20,184,166,0.25)]";
    if (accentBg.includes("indigo")) return "hover:bg-indigo-600 dark:hover:bg-indigo-600/90 hover:border-indigo-500 hover:shadow-[0_15px_30px_rgba(99,102,241,0.25)]";
    return "hover:bg-violet-600 dark:hover:bg-violet-600/90 hover:border-violet-500 hover:shadow-[0_15px_30px_rgba(139,92,246,0.25)]";
  };

  const hoverBgClass = getHoverBgClass(data.accentBg);

  return (
    <Card3D className={`group relative flex flex-col items-center justify-center text-center overflow-hidden rounded-3xl border border-neutral-200/80 dark:border-white/5 bg-white/80 dark:bg-neutral-900/40 p-6 backdrop-blur-md shadow-sm dark:shadow-none hover:scale-[1.02] transition-all duration-500 h-full min-h-[200px] cursor-pointer ${hoverBgClass}`}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(255,255,255,0.03),transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Title & Icon Header */}
      <div style={{ transform: "translateZ(40px)", transformStyle: "preserve-3d" }} className="flex flex-col items-center w-full">
        {/* Large Centered Free-standing Icon */}
        <div className={`[&>svg]:w-8 [&>svg]:h-8 ${data.iconTextClass} group-hover:text-white group-hover:scale-110 transition-all duration-300 mb-3`}>
          {data.iconName ? getIcon(data.iconName) : data.icon}
        </div>
        <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider font-sans group-hover:text-white transition-colors duration-300">
          {data.title}
        </h3>
      </div>

      {/* Description */}
      <div style={{ transform: "translateZ(30px)" }} className="text-center mt-3 w-full">
        <p className="text-[9px] md:text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
          {data.description}
        </p>
      </div>
    </Card3D>
  );
};

// ============================================================================
// MAIN COMPONENT EXPORT
// ============================================================================

export const ServicesSection = () => {
  const [services, setServices] = useState<ServiceCardData[]>(serviceList);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/services`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setServices(data);
        }
      })
      .catch((err) => console.error("Failed to fetch services:", err));
  }, []);

  return (
    <section id="services" className="py-16 relative overflow-hidden transition-colors duration-300">
      
      {/* Background ambient highlights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[40vw] rounded-full bg-violet-500/5 dark:bg-violet-900/5 blur-[130px] pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-blue-500/5 dark:bg-blue-900/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-white tracking-tight">
               Services
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base leading-relaxed">
              Delivering high-end engineering services focused on building scalable, performant, and visual full-stack web environments.
            </p>
          </div>
        </ScrollReveal>

        {/* 3-Column Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service, index) => (
            <ScrollReveal
              key={index}
              delay={index * 0.05}
              y={30}
              scale={0.96}
            >
              <div
                className="relative w-full h-full block group"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <AnimatePresence>
                  {hoveredIndex === index && (
                    <motion.span
                      className="absolute inset-0 h-full w-full bg-violet-500/10 dark:bg-violet-500/20 block rounded-3xl"
                      layoutId="hoverBackgroundService"
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
                <div className="relative z-10 w-full h-full">
                  <ServiceCard data={service} />
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
};
