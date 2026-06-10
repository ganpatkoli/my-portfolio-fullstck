import { useEffect, useState } from "react";
import { Quote } from "lucide-react";
import { ScrollReveal } from "./ui/scroll-reveal";
import { API_BASE } from "../lib/api";

interface Testimonial {
  quote: string;
  name: string;
  title: string;
  company: string;
  avatarBg: string;
  initials: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "Ganpat's engineering expertise at o2 technology was outstanding. He delivered a high-frequency WebSocket options dashboard that rendered option chains with remarkable efficiency, optimizing our DOM updates.",
    name: "Onkar Prasad",
    title: "Founder",
    company: "o2 Technology",
    avatarBg: "from-blue-500 to-cyan-500",
    initials: "OP",
  },
  {
    quote: "Working with Ganpat on our CloudDial client portal was a fantastic experience. He designed clean component architectures and integrated third-party identity APIs with legally compliant security grids.",
    name: "Dilip Chauhan",
    title: "Founder",
    company: "CloudDial",
    avatarBg: "from-purple-500 to-indigo-500",
    initials: "DC",
  },
  {
    quote: "Ganpat helped build our Green Dhara database logs portal. He structured a lightweight layout using Next.js and MongoDB, enabling our field managers to log tasks smoothly on the go.",
    name: "Anjali Arora",
    title: "Founder ",
    company: "Green Dhara Welfare Foundation",
    avatarBg: "from-emerald-500 to-teal-500",
    initials: "AA",
  },
  {
    quote: "Ganpat's component-driven design standards on LegalTerm are exemplary. He constructed the E-Sign wizard portal, streamlining SurePass API hooks and legal bond generation.",
    name: "Dheeraj Nigam",
    title: "Founder Member",
    company: "LegalTerm",
    avatarBg: "from-amber-500 to-rose-500",
    initials: "DN",
  },
];

export const TestimonialsSection = () => {
  const [testimonialsList, setTestimonialsList] = useState<Testimonial[]>(testimonials);

  useEffect(() => {
    fetch(`${API_BASE}/testimonials`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setTestimonialsList(data);
        }
      })
      .catch((err) => console.error("Failed to fetch testimonials:", err));
  }, []);

  // Clone testimonials array to create seamless loop marquee scroll
  const duplicatedTestimonials = [...testimonialsList, ...testimonialsList];

  return (
    <section id="testimonials" className="py-16 relative overflow-hidden transition-colors duration-300">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55vw] h-[30vw] rounded-full bg-violet-500/5 dark:bg-violet-900/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 ">
        <ScrollReveal>
          <div className="text-center mb-20">
           
            <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-white tracking-tight mb-4">
              Client Feedback
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto text-sm md:text-base leading-relaxed">
              Read recommendations and reviews from engineering leaders, startup founders, and technical partners.
            </p>
          </div>
        </ScrollReveal>

        {/* Infinite scrolling marquee wrapper */}
        <ScrollReveal y={30} scale={0.99}>
          <div className="w-full relative flex items-center overflow-x-hidden py-4 mask-fade-horizontal">
        {/* Left & Right fading masking edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-neutral-50 dark:from-[#030303] to-transparent z-10 pointer-events-none transition-all duration-300" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-neutral-50 dark:from-[#030303] to-transparent z-10 pointer-events-none transition-all duration-300" />

        {/* Scrolling tape row */}
        <div className="flex gap-6 animate-marquee hover:[animation-play-state:paused] whitespace-nowrap">
          {duplicatedTestimonials.map((item, index) => (
            <div
              key={index}
              className="inline-block w-[350px] sm:w-[420px] shrink-0 bg-white/70 dark:bg-neutral-900/10 border border-neutral-200 dark:border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-md hover:border-violet-500/20 hover:bg-neutral-100 dark:hover:bg-neutral-900/20 transition-all duration-300 whitespace-normal text-left shadow-sm dark:shadow-none"
            >
              {/* Quote Icon */}
              <Quote className="text-violet-500/20 mb-4" size={32} />

              {/* Quote body */}
              <p className="text-sm md:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium mb-6 italic">
                "{item.quote}"
              </p>

              {/* Author row */}
              <div className="flex items-center gap-4 border-t border-neutral-200 dark:border-white/5 pt-4">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${item.avatarBg} flex items-center justify-center text-xs font-bold text-white shadow-md`}>
                  {item.initials}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-850 dark:text-neutral-200">{item.name}</h4>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-550 font-medium">
                    {item.title} at <span className="text-neutral-700 dark:text-neutral-400 font-semibold">{item.company}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </ScrollReveal>
      </div>
    </section>
  );
};
