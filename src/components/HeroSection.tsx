import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowUpRight, Download, MapPin } from "lucide-react";
import { TextGenerateEffect } from "./ui/text-generate-effect";
import { API_BASE } from "../lib/api";

const Profile3DCard = ({ socials }: { socials: any[] }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Map mouse coordinate bounds to degree rotation [-22, 22] for a more pronounced 3D card tilt
  const rotateX = useTransform(y, [-240, 240], [22, -22]);
  const rotateY = useTransform(x, [-190, 190], [-22, 22]);

  // Compute a dynamic glare gradient background using a mix of orange and violet colors
  const glareBg = useTransform(
    [x, y],
    ([latestX, latestY]: number[]) => {
      const px = ((latestX + 190) / 380) * 100;
      const py = ((latestY + 240) / 480) * 100;
      return `radial-gradient(circle at ${px}% ${py}%, rgba(249,115,22,0.1) 0%, rgba(139,92,246,0.08) 45%, transparent 75%)`;
    }
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const linkedinSocial = socials.find(s => s.name.toLowerCase().includes("linkedin"));
  const linkedinUrl = linkedinSocial ? linkedinSocial.link : "https://www.linkedin.com/in/ganpatkoli/";

  return (
    <div
      className="w-full flex items-center justify-center p-4"
      style={{ perspective: 1200 }}
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="w-full max-w-[380px] h-[480px] bg-neutral-950 border border-white/[0.08] backdrop-blur-2xl rounded-[32px] flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.8)] hover:border-violet-500/30 hover:shadow-[0_20px_50px_rgba(249,115,22,0.08),0_20px_50px_rgba(139,92,246,0.12)] transition-all duration-500 group relative overflow-hidden"
      >
        {/* Shiny Parallax Glare Overlay */}
        <motion.div
          style={{
            background: glareBg,
          }}
          className="absolute inset-0 z-30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[32px]"
        />

        {/* Full Screen Image Background & Ambient Glow */}
        <div className="absolute inset-0 z-0 overflow-hidden rounded-[32px]">
          {/* Dotted Grid Background */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:16px_16px] z-0" />
          
          {/* Purple & Orange Glow behind the head (Ambient portal) */}
          <div className="absolute top-[15%] left-[15%] w-[220px] h-[220px] rounded-full bg-gradient-to-tr from-violet-600/20 to-orange-500/10 blur-3xl z-0 animate-pulse" />
          
          <img
            src="/profile.png"
            alt="Ganpat Koli"
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03] z-10"
          />
          {/* Gradient Overlay for card depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        </div>

        {/* Card Header Available status badge */}
        <div 
          style={{ transform: "translateZ(40px)" }}
          className="absolute top-4 left-4 z-25"
        >
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/25 bg-emerald-950/40 text-emerald-400 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Available</span>
          </div>
        </div>

        {/* Floating Glass Sub-card for Profile Info */}
        <div
          style={{ transform: "translateZ(70px)", transformStyle: "preserve-3d" }}
          className="absolute bottom-4 left-4 right-4 p-5 z-20 flex flex-col gap-3.5 text-left bg-black/60 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] group-hover:border-violet-500/20 transition-colors duration-500"
        >
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-white tracking-tight font-sans">
              Ganpat Koli
            </h3>
            <p className="text-xs font-semibold text-neutral-300 tracking-wide font-sans">
              Front-end Developer & Designer
            </p>
            <p className="text-xs text-neutral-400 flex items-center gap-1.5 font-sans font-bold mt-1">
              <MapPin size={12} className="text-orange-500" />
              <span>Indore, India</span>
            </p>
          </div>

          <a
            href={linkedinUrl}
            target="_blank"
            rel="noreferrer"
            style={{ transform: "translateZ(30px)" }}
            className="w-full py-3.5 rounded-xl border border-white/[0.06] bg-gradient-to-r from-violet-600/20 to-indigo-600/10 hover:from-violet-600/40 hover:to-indigo-600/30 text-white font-bold text-xs flex items-center justify-between px-4 transition-all duration-300 hover:border-violet-500/50 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)] group/btn backdrop-blur-md"
          >
            <div className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              <span>Let's Connect on LinkedIn</span>
            </div>
            <ArrowUpRight size={14} className="text-neutral-400 group-hover/btn:text-white transition-colors" />
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);
  const [socials, setSocials] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/socials`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSocials(data);
        }
      })
      .catch((err) => console.error("Failed to fetch socials in Hero:", err));
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      id="home"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-white pt-28 pb-12 select-none"
    >
      {/* Floating Mouse Glow Orb */}
      <div
        style={{
          left: mousePos.x + "px",
          top: mousePos.y + "px",
          transform: "translate(-50%, -50%)",
        }}
        className={`absolute w-[40vw] h-[40vw] rounded-full bg-[radial-gradient(circle,_rgba(249,115,22,0.06)_0%,_rgba(139,92,246,0.03)_50%,_transparent_100%)] blur-[80px] pointer-events-none z-10 transition-opacity duration-700 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column Content */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/10 dark:border-violet-500/20 bg-violet-500/5 backdrop-blur-md text-violet-300 text-xs font-semibold hover:border-violet-500/40 transition-colors shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="tracking-wider font-mono text-[10px] uppercase">Open to Contracts & Roles</span>
          </motion.div>

          {/* Large Styled Signature Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="space-y-1"
          >
            <p className="text-xl sm:text-2xl font-semibold text-white">Hi, I'm 👋</p>
            <h1 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight leading-tight">
              Ganpat <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Koli</span>
            </h1>
          </motion.div>

          {/* Subheading */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-3"
          >
            <p className="text-sm sm:text-base font-bold tracking-wider uppercase font-sans text-violet-500">
              Front-end Developer & Designer
            </p>
            <div className="h-[2px] w-36 bg-violet-600/40 rounded-full" />
          </motion.div>

          {/* Description details */}
          <div className="max-w-xl">
            <TextGenerateEffect
              words="A passionate Front-End Developer with 5+ years of experience architecting dynamic, high-performance web applications. I specialize in the React ecosystem, creating seamless UI/UX interactions, and delivering scalable enterprise solutions."
              className="text-neutral-450 text-sm sm:text-base md:text-lg leading-relaxed font-sans font-normal"
            />
          </div>

          {/* Action Callouts & Socials */}
          <div className="flex flex-col space-y-6 pt-2">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const el = document.getElementById("contact");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.35)] hover:shadow-[0_0_30px_rgba(139,92,246,0.55)] transition-all duration-300 cursor-pointer"
              >
                <span>Hire Me</span>
                <ArrowUpRight size={16} />
              </motion.button>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="/Ganpat_Koli_Resume.pdf"
                download="Ganpat_Koli_Resume.pdf"
                className="w-full sm:w-auto px-8 py-4 bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 hover:bg-neutral-800/60 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all duration-300"
              >
                <Download size={16} className="text-violet-400" />
                <span>Download CV</span>
              </motion.a>
            </div>

            {/* Socials & Freelancing links */}
            {socials.length > 0 && (
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest block">Find me on:</span>
                <div className="flex flex-wrap items-center gap-3">
                  {socials.map((social) => {
                    const slug = social.name.toLowerCase().replace(/\s+/g, "");
                    const iconSrc = social.icon || `https://cdn.simpleicons.org/${slug}/white`;
                    return (
                      <motion.a
                        key={social.name}
                        href={social.link}
                        target="_blank"
                        rel="noreferrer"
                        onMouseEnter={() => setHoveredSocial(social.name)}
                        onMouseLeave={() => setHoveredSocial(null)}
                        whileHover={{ scale: 1.12, y: -2 }}
                        className={`flex items-center justify-center w-11 h-11 rounded-xl border border-neutral-800 bg-[#0c0c0f]/60 backdrop-blur-md text-neutral-450 hover:text-white transition-all duration-300 ${
                          hoveredSocial !== null && hoveredSocial !== social.name
                            ? "blur-[1px] opacity-40 scale-[0.93]"
                            : "opacity-100 scale-100"
                        }`}
                        title={social.name}
                      >
                        <img
                          src={iconSrc}
                          alt={social.name}
                          className="w-5 h-5 object-contain opacity-80 hover:opacity-100 transition-opacity"
                          onError={(e) => {
                            if (!social.icon) {
                              (e.target as HTMLImageElement).src = `https://api.iconify.design/simple-icons:${slug}.svg?color=white`;
                            } else {
                              (e.target as HTMLImageElement).src = "https://api.iconify.design/lucide:globe.svg?color=white";
                            }
                          }}
                        />
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - 3D Profile Card Component */}
        <div className="lg:col-span-5 relative w-full flex items-center justify-center lg:justify-end min-h-[480px]">
          <Profile3DCard socials={socials} />
        </div>
      </div>
    </section>
  );
};

