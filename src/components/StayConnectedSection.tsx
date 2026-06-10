import { useEffect, useState } from "react";
import { Mail, Globe, MessageSquare } from "lucide-react";
import { ScrollReveal } from "./ui/scroll-reveal";
import { API_BASE } from "../lib/api";

interface SocialLink {
  _id?: string;
  name: string;
  link: string;
  icon?: string;
}

// Custom brand SVGs because brand icons are removed from newer lucide-react versions
const LinkedinIcon = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GithubIcon = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const TwitterIcon = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const YoutubeIcon = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
);

const FacebookIcon = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitchIcon = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2H3v16h5v4l4-4h5l5-5V2zm-10 9H9V6h2v5zm4 0h-2V6h2v5z" />
  </svg>
);

const UpworkIcon = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.561 3.28a4.873 4.873 0 00-4.87 4.867v2.967a5.163 5.163 0 01-2.036-3.814 4.872 4.872 0 00-4.869-4.867A4.878 4.878 0 001.917 8.3v5.433H0v1.734h1.917v5.253h1.733v-5.253h5.667v5.253h1.733v-5.253h1.666a4.868 4.868 0 004.866-4.866v-2.31a3.138 3.138 0 013.134-3.133 3.139 3.139 0 013.134 3.133v7.26h1.733v-7.26A4.873 4.873 0 0018.561 3.28zM8.333 13.733H3.65V8.3a3.138 3.138 0 016.783-5.17 3.14 3.14 0 013.134 3.13 3.11 3.11 0 01-1.584 2.77 5.12 5.12 0 01-.001 2.663z"/>
  </svg>
);

const FiverrIcon = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.1 2.859h-2.433c-1.332 0-2.464 1.077-2.585 2.408l-.13 1.45H9.68v2.443h2.15l-.894 8.016H8.283v2.443h5.31c1.332 0 2.464-1.077 2.585-2.408l.13-1.45h2.27v-2.443h-2.15l.894-8.016h2.656V2.859h-2.88zM21.57 2.859h-2.27v16.657h2.27V2.859z"/>
  </svg>
);

const FreelancerIcon = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.652 2.766L23.414 12H13.652V2.766z M0 12h11.238l-4.707-4.428L0 12z M13.652 14.156H24L13.652 24V14.156z M0 14.156l9.648 9.078V14.156H0z"/>
  </svg>
);

const BehanceIcon = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.784 5c1.554 0 2.738.358 3.524 1.063C12.1 6.764 12.5 7.777 12.5 9.079c0 1.002-.239 1.829-.714 2.457-.476.629-1.129 1.054-1.948 1.258v.068c1 .205 1.777.69 2.316 1.442.539.754.809 1.7.809 2.825 0 1.488-.445 2.636-1.332 3.42C10.74 21.319 9.387 21.7 7.574 21.7H2V5h5.784zm-.397 6.643c.895 0 1.542-.187 1.928-.558.386-.37.58-.908.58-1.603 0-.663-.18-1.173-.538-1.517-.358-.344-.954-.517-1.777-.517H4.4v4.195H7.387zm.374 7.535c1.002 0 1.74-.216 2.19-.646.452-.43.68-1.034.68-1.802 0-.742-.239-1.32-.72-1.716-.481-.397-1.285-.595-2.384-.595H4.4v4.759h3.361zM22 13.916h-5.834c.068 1.157.448 2.03 1.129 2.59.68.562 1.554.842 2.613.842.817 0 1.52-.162 2.099-.484.58-.323.97-.757 1.168-1.298H24c-.386 1.258-1.163 2.274-2.316 3.02C20.531 21.34 19 21.7 17.156 21.7c-2.316 0-4.148-.707-5.469-2.112-1.32-1.405-1.982-3.324-1.982-5.728s.646-4.35 1.942-5.753C12.943 6.704 14.7 6 16.916 6c2.155 0 3.864.672 5.093 2.007 1.23 1.336 1.83 3.197 1.796 5.568H22v.341zm-1.224-2c-.046-.94-.324-1.68-.829-2.2-.505-.523-1.18-.783-2.037-.783-.872 0-1.572.26-2.099.783-.528.52-.817 1.26-.864 2.2h5.829zM15 4h5v1.2h-5V4z"/>
  </svg>
);

const DribbbleIcon = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 2.06c-3.11-.19-7.89-.08-11.45 4.38" />
  </svg>
);

const ToptalIcon = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.219 10.372L12 1.84 3.781 10.372h4.55v11.788h7.338V10.372z"/>
  </svg>
);

const getSocialDetails = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("linkedin")) {
    return {
      icon: <LinkedinIcon size={24} />,
      color: "hover:bg-[#0A66C2] hover:border-[#0A66C2]",
      textColor: "group-hover:text-white"
    };
  }
  if (lowerName.includes("github")) {
    return {
      icon: <GithubIcon size={24} />,
      color: "hover:bg-[#333] hover:border-[#333] dark:hover:bg-white dark:hover:border-white",
      textColor: "group-hover:text-white dark:group-hover:text-black"
    };
  }
  if (lowerName.includes("twitter") || lowerName === "x") {
    return {
      icon: <TwitterIcon size={24} />,
      color: "hover:bg-[#1DA1F2] hover:border-[#1DA1F2]",
      textColor: "group-hover:text-white"
    };
  }
  if (lowerName.includes("mail") || lowerName.includes("email")) {
    return {
      icon: <Mail size={24} />,
      color: "hover:bg-rose-500 hover:border-rose-500",
      textColor: "group-hover:text-white"
    };
  }
  if (lowerName.includes("youtube")) {
    return {
      icon: <YoutubeIcon size={24} />,
      color: "hover:bg-[#FF0000] hover:border-[#FF0000]",
      textColor: "group-hover:text-white"
    };
  }
  if (lowerName.includes("facebook")) {
    return {
      icon: <FacebookIcon size={24} />,
      color: "hover:bg-[#1877F2] hover:border-[#1877F2]",
      textColor: "group-hover:text-white"
    };
  }
  if (lowerName.includes("twitch")) {
    return {
      icon: <TwitchIcon size={24} />,
      color: "hover:bg-[#9146FF] hover:border-[#9146FF]",
      textColor: "group-hover:text-white"
    };
  }
  if (lowerName.includes("discord")) {
    return {
      icon: <MessageSquare size={24} />,
      color: "hover:bg-[#5865F2] hover:border-[#5865F2]",
      textColor: "group-hover:text-white"
    };
  }
  if (lowerName.includes("upwork")) {
    return {
      icon: <UpworkIcon size={24} />,
      color: "hover:bg-[#14A800] hover:border-[#14A800]",
      textColor: "group-hover:text-white"
    };
  }
  if (lowerName.includes("fiverr")) {
    return {
      icon: <FiverrIcon size={24} />,
      color: "hover:bg-[#1DBF73] hover:border-[#1DBF73]",
      textColor: "group-hover:text-white"
    };
  }
  if (lowerName.includes("freelancer")) {
    return {
      icon: <FreelancerIcon size={24} />,
      color: "hover:bg-[#29B2FE] hover:border-[#29B2FE]",
      textColor: "group-hover:text-white"
    };
  }
  if (lowerName.includes("behance")) {
    return {
      icon: <BehanceIcon size={24} />,
      color: "hover:bg-[#0057FF] hover:border-[#0057FF]",
      textColor: "group-hover:text-white"
    };
  }
  if (lowerName.includes("dribbble")) {
    return {
      icon: <DribbbleIcon size={24} />,
      color: "hover:bg-[#EA4C89] hover:border-[#EA4C89]",
      textColor: "group-hover:text-white"
    };
  }
  if (lowerName.includes("toptal")) {
    return {
      icon: <ToptalIcon size={24} />,
      color: "hover:bg-[#3863A0] hover:border-[#3863A0]",
      textColor: "group-hover:text-white"
    };
  }
  return {
    icon: <Globe size={24} />,
    color: "hover:bg-violet-600 hover:border-violet-600",
    textColor: "group-hover:text-white"
  };
};

export const StayConnectedSection = () => {
  const [socials, setSocials] = useState<SocialLink[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/socials`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSocials(data);
        }
      })
      .catch((err) => console.error("Failed to fetch socials:", err));
  }, []);

  if (socials.length === 0) return null;

  return (
    <section id="stay-connected" className="py-16 relative overflow-hidden transition-colors duration-300">
      
      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
        <ScrollReveal>
          <div className="mb-12">
            <div className="text-violet-600 dark:text-violet-400 text-xs font-semibold uppercase tracking-widest mb-3">
              Socials
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight font-sans">
              Stay Connected
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mt-4 text-base max-w-xl mx-auto font-sans leading-relaxed">
              Follow me on social media to see my latest projects, tech insights, and daily updates.
            </p>
          </div>
        </ScrollReveal>

        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
          {socials.map((social, index) => {
            const hasCustomIcon = !!social.icon;
            const details = hasCustomIcon
              ? {
                  icon: (
                    <img
                      src={social.icon}
                      alt={social.name}
                      className="w-6 h-6 object-contain rounded-md"
                    />
                  ),
                  color: "hover:bg-violet-600/10 hover:border-violet-500/30 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]",
                  textColor: "group-hover:text-violet-450 dark:group-hover:text-violet-400"
                }
              : getSocialDetails(social.name);

            return (
              <ScrollReveal
                key={social.name + "-" + index}
                delay={index * 0.05}
                y={25}
                scale={0.97}
              >
                <a
                  href={social.link}
                  target="_blank"
                  rel="noreferrer"
                  className={`group flex items-center gap-3 px-6 py-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl ${details.color} hover:-translate-y-2 cursor-pointer`}
                >
                  <div className={`text-neutral-600 dark:text-neutral-400 transition-colors duration-300 flex items-center justify-center ${details.textColor}`}>
                    {details.icon}
                  </div>
                  <span className={`font-semibold text-neutral-700 dark:text-neutral-300 transition-colors duration-300 ${details.textColor}`}>
                    {social.name}
                  </span>
                </a>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
