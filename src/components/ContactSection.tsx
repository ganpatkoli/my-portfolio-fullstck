import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  CheckCircle,
  MapPin,
  Clock,
  Send,
  ArrowUpRight,
} from "lucide-react";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { ScrollReveal } from "./ui/scroll-reveal";
import { API_BASE } from "../lib/api";

// ============================================================================
// CONTACT INFO & SOCIAL DATA
// ============================================================================

const contactInfo = [
  {
    icon: <Mail size={18} />,
    label: "Email",
    value: "theganpatkoli@gmail.com",
    link: "mailto:theganpatkoli@gmail.com",
    color: "from-violet-500/20 to-purple-500/20",
    iconColor: "text-violet-400",
    borderColor: "border-violet-500/20",
  },
  
  {
    icon: <MapPin size={18} />,
    label: "Location",
    value: "India",
    link: null,
    color: "from-orange-500/20 to-amber-500/20",
    iconColor: "text-orange-400",
    borderColor: "border-orange-500/20",
  },
  {
    icon: <Clock size={18} />,
    label: "Availability",
    value: "Mon – Sat, 10 AM – 7 PM IST",
    link: null,
    color: "from-sky-500/20 to-cyan-500/20",
    iconColor: "text-sky-400",
    borderColor: "border-sky-500/20",
  },
];

const getContactSocialDetails = (name: string, isCustom?: boolean) => {
  const lowerName = name.toLowerCase();
  
  if (isCustom) {
    return {
      hoverBg: "hover:bg-violet-600/10 hover:border-violet-500/20 hover:text-violet-400 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]",
    };
  }

  if (lowerName.includes("linkedin")) {
    return {
      hoverBg: "hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:text-white hover:shadow-[0_0_20px_rgba(10,102,194,0.3)]",
    };
  }
  if (lowerName.includes("github")) {
    return {
      hoverBg: "hover:bg-neutral-700 hover:border-neutral-700 dark:hover:bg-white dark:hover:border-white dark:hover:text-black hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]",
    };
  }
  if (lowerName.includes("upwork")) {
    return {
      hoverBg: "hover:bg-[#14a800] hover:border-[#14a800] hover:text-white hover:shadow-[0_0_20px_rgba(20,168,0,0.3)]",
    };
  }
  if (lowerName.includes("freelancer")) {
    return {
      hoverBg: "hover:bg-[#29b2fe] hover:border-[#29b2fe] hover:text-white hover:shadow-[0_0_20px_rgba(41,178,254,0.3)]",
    };
  }
  if (lowerName.includes("fiverr")) {
    return {
      hoverBg: "hover:bg-[#1dbf73] hover:border-[#1dbf73] hover:text-white hover:shadow-[0_0_20px_rgba(29,191,115,0.3)]",
    };
  }
  if (lowerName.includes("arc")) {
    return {
      hoverBg: "hover:bg-[#0972d3] hover:border-[#0972d3] hover:text-white hover:shadow-[0_0_20px_rgba(9,114,211,0.3)]",
    };
  }
  return {
    hoverBg: "hover:bg-violet-600 hover:border-violet-600 hover:text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]",
  };
};

// ============================================================================
// COMPONENT
// ============================================================================

export const ContactSection = () => {
  const [formState, setFormState] = useState({
    fullName: "",
    email: "",
    company: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [socialsList, setSocialsList] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/socials`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSocialsList(data);
        }
      })
      .catch((err) => console.error("Failed to fetch socials in ContactSection:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.fullName || !formState.email || !formState.message) return;

    setIsSubmitting(true);

    let dbSaved = false;

    try {
      // First try saving to the local database API
      const dbResponse = await fetch(`${API_BASE}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formState.fullName,
          email: formState.email,
          company: formState.company,
          message: formState.message,
        }),
      });

      const dbResult = await dbResponse.json();

      if (dbResult.success) {
        dbSaved = true;
        setIsSubmitted(true);
        setFormState({ fullName: "", email: "", company: "", message: "" });
      }
    } catch (error) {
      console.warn("Local DB api failed, falling back to Web3Forms:", error);
    }

    if (!dbSaved) {
      // Secondary fallback to Web3Forms
      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: "8ea7f126-a5aa-4190-879f-a06de4386e2d",
            name: formState.fullName,
            email: formState.email,
            company: formState.company,
            message: formState.message,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setIsSubmitted(true);
          setFormState({ fullName: "", email: "", company: "", message: "" });
        } else {
          console.error("Form submission failed:", result);
          alert("Failed to send message. Please try again.");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("Something went wrong. Please try again later.");
      }
    }

    setIsSubmitting(false);
  };

  return (
    <section
      id="contact"
      className="py-20 relative overflow-hidden transition-colors duration-300"
    >
      {/* Background effects */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-violet-500/[0.03] dark:bg-violet-900/[0.04] blur-[140px] pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-sky-500/[0.03] dark:bg-sky-900/[0.04] blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-white tracking-tight">
              Get in Touch
            </h2>
            <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-400 mt-3 max-w-xl mx-auto leading-relaxed">
              Have a project in mind or want to collaborate? Drop me a message and
              I'll get back to you as soon as possible.
            </p>
          </div>
        </ScrollReveal>

        {/* Main Grid: Info Left + Form Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          {/* ─── LEFT COLUMN ─── */}
          <ScrollReveal direction="right" y={25} scale={1} blur={false}>
            <div className="space-y-8">
            {/* Contact Info Cards */}
            <div className="space-y-3">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.35, delay: index * 0.08 }}
                >
                  {item.link ? (
                    <a
                      href={item.link}
                      target={item.link.startsWith("mailto") || item.link.startsWith("tel") ? undefined : "_blank"}
                      rel="noreferrer"
                      className="group flex items-center gap-4 p-4 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 bg-white/40 dark:bg-neutral-900/30 backdrop-blur-sm hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 hover:shadow-lg hover:shadow-neutral-200/20 dark:hover:shadow-neutral-900/30"
                    >
                      <div
                        className={`shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} border ${item.borderColor} flex items-center justify-center ${item.iconColor} group-hover:scale-110 transition-transform duration-300`}
                      >
                        {item.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 dark:text-neutral-500 mb-0.5">
                          {item.label}
                        </p>
                        <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                          {item.value}
                        </p>
                      </div>
                      <ArrowUpRight
                        size={14}
                        className="ml-auto shrink-0 text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-500 dark:group-hover:text-neutral-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
                      />
                    </a>
                  ) : (
                    <div className="group flex items-center gap-4 p-4 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 bg-white/40 dark:bg-neutral-900/30 backdrop-blur-sm">
                      <div
                        className={`shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} border ${item.borderColor} flex items-center justify-center ${item.iconColor}`}
                      >
                        {item.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 dark:text-neutral-500 mb-0.5">
                          {item.label}
                        </p>
                        <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            {socialsList.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 dark:text-neutral-500 px-1">
                  Connect with me
                </h4>
                <div className="flex flex-wrap gap-2">
                  {socialsList.map((social, index) => {
                    const details = getContactSocialDetails(social.name, !!social.icon);
                    const slug = social.name.toLowerCase().replace(/\s+/g, "");
                    const iconSrc = social.icon || `https://cdn.simpleicons.org/${slug}/white`;
                    return (
                      <motion.a
                        key={social.name}
                        href={social.link}
                        target="_blank"
                        rel="noreferrer"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        className={`group flex items-center gap-2 px-3.5 py-2 rounded-xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white/50 dark:bg-neutral-900/40 text-neutral-600 dark:text-neutral-400 backdrop-blur-sm transition-all duration-300 ${details.hoverBg}`}
                      >
                        <span className="shrink-0 flex items-center justify-center">
                          <img
                            src={iconSrc}
                            alt={social.name}
                            className={`w-4 h-4 object-contain opacity-75 group-hover:opacity-100 transition-opacity ${
                              !social.icon ? "dark:invert-0 invert group-hover:invert-0" : ""
                            }`}
                            onError={(e) => {
                              if (!social.icon) {
                                (e.target as HTMLImageElement).src = `https://api.iconify.design/simple-icons:${slug}.svg?color=white`;
                              } else {
                                (e.target as HTMLImageElement).src = "https://api.iconify.design/lucide:globe.svg?color=white";
                              }
                            }}
                          />
                        </span>
                        <span className="text-xs font-medium">{social.name}</span>
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            )}

           
            </div>
          </ScrollReveal>

          {/* ─── RIGHT COLUMN: FORM ─── */}
          <ScrollReveal direction="left" y={25} delay={0.15} scale={1} blur={false}>
            <div className="w-full rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 bg-white/50 dark:bg-neutral-950/60 backdrop-blur-xl p-6 md:p-8 shadow-xl shadow-neutral-200/10 dark:shadow-neutral-950/20 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors duration-500 relative overflow-hidden">
              {/* Subtle grid dots background */}
              <div
                className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04] pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, currentColor 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16 space-y-5 relative z-10"
                >
                  <div className="inline-flex p-4 rounded-full bg-emerald-500/[0.07] border border-emerald-500/20 text-emerald-400 mb-2">
                    <CheckCircle size={36} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 tracking-tight">
                    Message Sent Successfully
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto leading-relaxed">
                    Thank you for reaching out. I'll get back to you shortly.
                  </p>
                  <HoverBorderGradient
                    containerClassName="w-auto mt-4 mx-auto"
                    className="px-5 py-2 bg-white dark:bg-neutral-900/50 text-sm font-medium text-neutral-700 dark:text-neutral-300"
                    onClick={() => setIsSubmitted(false)}
                  >
                    Send Another Message
                  </HoverBorderGradient>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5 relative z-10"
                >
                  {/* Name & Email - Side by Side on md+ */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="fullName"
                        className={`text-[10px] uppercase tracking-widest font-semibold transition-colors duration-200 ${
                          focusedField === "fullName"
                            ? "text-violet-500 dark:text-violet-400"
                            : "text-neutral-400 dark:text-neutral-500"
                        }`}
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        required
                        value={formState.fullName}
                        onFocus={() => setFocusedField("fullName")}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            fullName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/50 text-neutral-800 dark:text-neutral-200 placeholder-neutral-350 dark:placeholder-neutral-600 focus:outline-none focus:border-violet-400/60 dark:focus:border-violet-500/40 focus:ring-1 focus:ring-violet-400/30 dark:focus:ring-violet-500/20 transition-all text-sm"
                        placeholder="John Doe"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="email"
                        className={`text-[10px] uppercase tracking-widest font-semibold transition-colors duration-200 ${
                          focusedField === "email"
                            ? "text-violet-500 dark:text-violet-400"
                            : "text-neutral-400 dark:text-neutral-500"
                        }`}
                      >
                        Email *
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          id="email"
                          required
                          value={formState.email}
                          onFocus={() => setFocusedField("email")}
                          onBlur={() => setFocusedField(null)}
                          onChange={(e) =>
                            setFormState({
                              ...formState,
                              email: e.target.value,
                            })
                          }
                          className="w-full pl-4 pr-10 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/50 text-neutral-800 dark:text-neutral-200 placeholder-neutral-350 dark:placeholder-neutral-600 focus:outline-none focus:border-violet-400/60 dark:focus:border-violet-500/40 focus:ring-1 focus:ring-violet-400/30 dark:focus:ring-violet-500/20 transition-all text-sm"
                          placeholder="you@email.com"
                        />
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                          <Mail
                            size={14}
                            className="text-neutral-300 dark:text-neutral-600"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="company"
                      className={`text-[10px] uppercase tracking-widest font-semibold transition-colors duration-200 ${
                        focusedField === "company"
                          ? "text-violet-500 dark:text-violet-400"
                          : "text-neutral-400 dark:text-neutral-500"
                      }`}
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      id="company"
                      value={formState.company}
                      onFocus={() => setFocusedField("company")}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          company: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/50 text-neutral-800 dark:text-neutral-200 placeholder-neutral-350 dark:placeholder-neutral-600 focus:outline-none focus:border-violet-400/60 dark:focus:border-violet-500/40 focus:ring-1 focus:ring-violet-400/30 dark:focus:ring-violet-500/20 transition-all text-sm"
                      placeholder="Project discussion, Collaboration, etc."
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="message"
                      className={`text-[10px] uppercase tracking-widest font-semibold transition-colors duration-200 ${
                        focusedField === "message"
                          ? "text-violet-500 dark:text-violet-400"
                          : "text-neutral-400 dark:text-neutral-500"
                      }`}
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={4}
                      value={formState.message}
                      onFocus={() => setFocusedField("message")}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          message: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/50 text-neutral-800 dark:text-neutral-200 placeholder-neutral-350 dark:placeholder-neutral-600 focus:outline-none focus:border-violet-400/60 dark:focus:border-violet-500/40 focus:ring-1 focus:ring-violet-400/30 dark:focus:ring-violet-500/20 transition-all text-sm resize-none"
                      placeholder="Tell me about your project or idea..."
                    />
                  </div>

                  {/* Submit Button */}
                  <HoverBorderGradient
                    as="button"
                    type="submit"
                    disabled={isSubmitting}
                    containerClassName="w-full mt-2"
                    className="w-full px-6 py-3 bg-neutral-900 dark:bg-neutral-950/80 text-white text-sm font-medium flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        Send Message
                      </>
                    )}
                  </HoverBorderGradient>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
