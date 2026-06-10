import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";


export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Track active section
      const sections = ["home", "services", "tech-stack", "projects", "experience", "testimonials", "contact"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setIsOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navLinks = [
    { name: "Home", id: "home" },
    { name: "Services", id: "services" },
    { name: "Tech Stack", id: "tech-stack" },
    { name: "Projects", id: "projects" },
    { name: "Experience", id: "experience" },
    { name: "Testimonials", id: "testimonials" },
    { name: "Contact", id: "contact" },
  ];

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-6xl rounded-2xl border transition-all duration-300 ${
        scrolled
          ? "bg-black border-neutral-200/80 dark:border-neutral-800/80 backdrop-blur-md py-3 shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]"
          : "bg-transparent border-transparent py-5"
      }`}
    >
      <div className="px-6 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => scrollTo("home")}
          className="text-xl font-bold cursor-pointer bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 dark:from-violet-400 dark:via-fuchsia-500 dark:to-cyan-400 bg-clip-text text-transparent hover:scale-105 transition-transform"
        >
          Ganpat Koli 
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`text-sm font-medium transition-all relative py-1 hover:text-neutral-900 dark:hover:text-white ${
                activeSection === link.id ? "text-neutral-900 dark:text-white" : "text-neutral-500 dark:text-neutral-400"
              }`}
            >
              {link.name}
              {activeSection === link.id && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-2">
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/50 text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-all"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full mt-2 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-black/95 backdrop-blur-xl flex flex-col gap-4 animate-in fade-in slide-in-from-top-5 duration-200 shadow-lg dark:shadow-none">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`text-left text-base py-2 px-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors ${
                activeSection === link.id
                  ? "text-neutral-950 dark:text-white font-semibold bg-neutral-50 dark:bg-neutral-950/80 border-l-2 border-violet-500"
                  : "text-neutral-600 dark:text-neutral-400"
              }`}
            >
              {link.name}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

