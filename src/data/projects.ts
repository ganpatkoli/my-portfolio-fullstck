export type TechCategory = "Frontend" | "Backend" | "App" | "Fullstack";
export type RelationCategory = "Client" | "Personal" | "Self" | "Company" | "Company Product";

export interface Project {
  title: string;
  description: string;
  detailedDescription: string;
  tags: string[];
  githubUrl: string;
  liveUrl: string;
  role: string;
  techCategory: TechCategory;
  relationCategory: RelationCategory;
  client?: string;
  images?: string[];
}

export const projects: Project[] = [
  {
    title: "Options Trading Strategy",
    role: "Front-End Developer",
    description: "Algorithmic option chain and strategy builder (SMART-ALGO) developed for o2 Technology.",
    detailedDescription: "Built a comprehensive algorithmic option chain analysis and strategy builder platform (SMART-ALGO) for o2 Technology. Features include real-time WebSocket-driven option chain data streaming, advanced strategy construction with multi-leg options, P&L visualization charts, and a responsive trading interface optimized for rapid decision-making.",
    tags: ["React-JS", "WebSockets", "Redux Toolkit", "TypeScript", "Tailwind CSS"],
    githubUrl: "https://github.com/ganpatkoli",
    liveUrl: "https://ganpatkoli.netlify.app/",
    techCategory: "Frontend",
    relationCategory: "Client",
    client: "o2 Technology",
  },
  {
    title: "CloudDial Client Portal",
    role: "Front-End Developer",
    description: "Outreach log client workspace and customer calling portal developed for CloudDial.",
    detailedDescription: "Developed a full-featured client workspace and outbound calling portal for CloudDial. The portal includes customer contact management, call logging with real-time status updates, campaign tracking dashboards, and detailed outreach analytics. Integrated REST APIs for seamless data synchronization, and built responsive UI components with Bootstrap ensuring cross-device compatibility for sales teams operating remotely.",
    tags: ["React-JS", "Redux", "Express.js", "REST APIs", "Bootstrap"],
    githubUrl: "https://github.com/ganpatkoli",
    liveUrl: "https://ganpatkoli.netlify.app/",
    techCategory: "Frontend",
    relationCategory: "Client",
    client: "CloudDial",
  },
  {
    title: "Green Dhara Logs Portal",
    role: "Full-Stack Developer",
    description: "Administrative Next.js database logs portal built for the Green Dhara Welfare Foundation.",
    detailedDescription: "Architected and built an administrative database logs portal for the Green Dhara Welfare Foundation using Next.js and TypeScript. The system provides comprehensive CRUD operations for managing organizational records, donation tracking, volunteer management, and activity logging with MongoDB as the persistence layer. Leveraged shadcn/ui components for a polished admin interface with data tables, filters, and export capabilities.",
    tags: ["Next.js", "TypeScript", "shadcn", "MongoDB", "Tailwind CSS"],
    githubUrl: "https://github.com/ganpatkoli",
    liveUrl: "https://ganpatkoli.netlify.app/",
    techCategory: "Frontend",
    relationCategory: "Client",
    client: "Green Dhara Welfare Foundation",
  },
  {
    title: "LegalTerm E-Sign Portal",
    role: "Front-End Developer",
    description: "Secure digital signature signing wizard workflow integrated with SurePass verification APIs.",
    detailedDescription: "Built a secure digital signature portal with a multi-step signing wizard workflow for LegalTerm. Integrated SurePass verification APIs for Aadhaar-based eKYC and digital signature authentication. The system supports document upload, preview, signature placement, OTP verification, and signed document download. Implemented robust form validation, session management, and secure API communication patterns with Redux for state orchestration.",
    tags: ["React-JS", "Redux", "MySQL", "SurePass API", "REST APIs"],
    githubUrl: "https://github.com/ganpatkoli",
    liveUrl: "https://ganpatkoli.netlify.app/",
    techCategory: "Frontend",
    relationCategory: "Client",
    client: "LegalTerm",
  },
  {
    title: "Portfolio Website",
    role: "Full-Stack Developer",
    description: "Personal portfolio website built with React, Vite, Framer Motion, and Tailwind CSS.",
    detailedDescription: "Designed and developed a high-performance personal portfolio website showcasing professional work and skills. Built with React and Vite for blazing-fast HMR and builds, Framer Motion for premium micro-animations and page transitions, and Tailwind CSS for utility-first responsive styling. Features include dark mode support, 3D card effects, smooth scroll navigation, and an optimized contact section.",
    tags: ["React", "Vite", "Framer Motion", "Tailwind CSS", "TypeScript"],
    githubUrl: "https://github.com/ganpatkoli",
    liveUrl: "https://ganpatkoli.netlify.app/",
    techCategory: "Frontend",
    relationCategory: "Self",
  },
  // We can add dummy projects here so the user can see the "View All Projects" functionality
  {
    title: "Multiplayer Fantasy Game Engine",
    role: "Team Lead - Front-End",
    description: "Real-time fantasy gaming portal managing leaderboards and scoring.",
    detailedDescription: "Delivered multiplayer fantasy games for 200,000+ users for international clients. Implemented Redis caching across gaming modules optimizing session handling and reducing system latency by 35%. Managed complete frontend architecture across all projects ensuring performance, scalability, and smooth user experience.",
    tags: ["React", "SocketIO", "Redis", "Redux-Saga", "AWS"],
    githubUrl: "https://github.com/ganpatkoli",
    liveUrl: "https://ganpatkoli.netlify.app/",
    techCategory: "Frontend",
    relationCategory: "Client",
    client: "Codeverse IT",
  },
  {
    title: "Taxi Booking App UI",
    role: "Team Lead - Front-End",
    description: "Taxi booking system with live driver tracking and route optimization.",
    detailedDescription: "Developed taxi booking system with live driver tracking and route optimization handling 1000+ daily ride requests with fault-tolerant backend architecture. Integrated map APIs and WebSockets for real-time driver tracking.",
    tags: ["React Native", "Node.js", "MongoDB", "Maps API"],
    githubUrl: "https://github.com/ganpatkoli",
    liveUrl: "https://ganpatkoli.netlify.app/",
    techCategory: "App",
    relationCategory: "Client",
    client: "Codeverse IT",
  },
  {
    title: "Internal Chat Platform",
    role: "Team Lead - Front-End",
    description: "Real-time internal chat platform supporting 500+ concurrent users.",
    detailedDescription: "Built real-time internal chat platform using SocketIO and Redis supporting 500+ concurrent users with 40% improvement in message delivery performance. Features included group channels, file sharing, and read receipts.",
    tags: ["Next.js", "SocketIO", "Redis", "Redux Toolkit"],
    githubUrl: "https://github.com/ganpatkoli",
    liveUrl: "https://ganpatkoli.netlify.app/",
    techCategory: "Frontend",
    relationCategory: "Client",
    client: "Codeverse IT",
  }
];

export const techCategories: ("All" | TechCategory)[] = [
  "All",
  "Frontend",
  "Backend",
  "App",
];

export const relationCategories: ("All" | RelationCategory)[] = [
  "All",
  "Client",
  "Company Product",
  "Personal",
  "Self",
];
