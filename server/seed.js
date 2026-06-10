import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { User, Project, Service, Tech, Experience, Testimonial, Social } from "./models.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/portfolio";

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`Connected to MongoDB at ${MONGODB_URI} for seeding...`);

    // 1. Clear existing database
    await User.deleteMany({});
    await Project.deleteMany({});
    await Service.deleteMany({});
    await Tech.deleteMany({});
    await Experience.deleteMany({});
    await Testimonial.deleteMany({});
    await Social.deleteMany({});
    console.log("Cleared existing database collections.");

    // 2. Create Default Admin User
    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "adminPassword123";
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const adminUser = new User({
      username: adminUsername,
      password: hashedPassword
    });
    await adminUser.save();
    console.log(`Created default admin user (Username: '${adminUsername}', Password: '${adminPassword}').`);

    // 3. Seed Projects
    const projects = [
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
    await Project.insertMany(projects);
    console.log("Seeded projects data.");

    // 4. Seed Services
    const services = [
      {
        title: "SaaS Development",
        description: "Designing and building scalable multi-tenant SaaS platforms, secure subscription flows, and cloud integration architectures.",
        techs: ["React-JS", "Node.js", "Stripe API", "Cloud Solutions"],
        accentBg: "bg-violet-500",
        iconBgClass: "bg-violet-50 dark:bg-violet-950/20",
        iconTextClass: "text-violet-600 dark:text-violet-400",
        iconBorderClass: "border-violet-100 dark:border-violet-500/10",
        iconName: "Cpu"
      },
      {
        title: "Fullstack Development",
        description: "Engineering complete, robust web applications combining responsive client side layers with secure backend databases.",
        techs: ["React-JS", "Node.js", "MongoDB", "Express"],
        accentBg: "bg-cyan-500",
        iconBgClass: "bg-cyan-50 dark:bg-cyan-950/20",
        iconTextClass: "text-cyan-600 dark:text-cyan-400",
        iconBorderClass: "border-cyan-100 dark:border-cyan-500/10",
        iconName: "Layers"
      },
      {
        title: "Mobile App Development",
        description: "Building fast, high-performance cross-platform mobile apps for iOS and Android using React Native and Redux.",
        techs: ["React Native", "iOS / Android", "Redux", "Native APIs"],
        accentBg: "bg-purple-500",
        iconBgClass: "bg-purple-50 dark:bg-purple-950/20",
        iconTextClass: "text-purple-600 dark:text-purple-400",
        iconBorderClass: "border-purple-100 dark:border-purple-500/10",
        iconName: "Smartphone"
      },
      {
        title: "Website Development",
        description: "Creating lightning-fast marketing web portals with modern styling, SEO optimization, and smooth interactive animations.",
        techs: ["Next.js", "Vite", "Tailwind CSS", "Framer Motion"],
        accentBg: "bg-blue-500",
        iconBgClass: "bg-blue-50 dark:bg-blue-950/20",
        iconTextClass: "text-blue-600 dark:text-blue-400",
        iconBorderClass: "border-blue-100 dark:border-blue-500/10",
        iconName: "TrendingUp"
      },
      {
        title: "DevOps & Cloud",
        description: "Automating software deployment cycles, continuous CI/CD pipelines, container clustering, and cloud configurations.",
        techs: ["Docker", "AWS / GCP", "GitHub Actions", "CI / CD"],
        accentBg: "bg-emerald-500",
        iconBgClass: "bg-emerald-50 dark:bg-emerald-950/20",
        iconTextClass: "text-emerald-600 dark:text-emerald-400",
        iconBorderClass: "border-emerald-100 dark:border-emerald-500/10",
        iconName: "RefreshCw"
      },
      {
        title: "CRM Systems",
        description: "Developing custom Customer Relationship Management platforms tailored to automate company sales funnels and client tracking.",
        techs: ["React", "Analytics", "Pipeline Automations", "APIs"],
        accentBg: "bg-rose-500",
        iconBgClass: "bg-rose-50 dark:bg-rose-950/20",
        iconTextClass: "text-rose-600 dark:text-rose-400",
        iconBorderClass: "border-rose-100 dark:border-rose-500/10",
        iconName: "Handshake"
      },
      {
        title: "Fantasy Games",
        description: "Architecting interactive draft dashboards, sports gamification logic, and real-time live score updates.",
        techs: ["React-JS", "WebSockets", "State Logic", "Real-Time Sync"],
        accentBg: "bg-amber-500",
        iconBgClass: "bg-amber-50 dark:bg-amber-950/20",
        iconTextClass: "text-amber-600 dark:text-amber-400",
        iconBorderClass: "border-amber-100 dark:border-amber-500/10",
        iconName: "Gamepad2"
      },
      {
        title: "Admin Panels",
        description: "Designing corporate dashboards with detailed charts displays, advanced search grids, and role-based permissions.",
        techs: ["React", "Tailwind CSS", "Data Tables", "Recharts"],
        accentBg: "bg-teal-500",
        iconBgClass: "bg-teal-50 dark:bg-teal-950/20",
        iconTextClass: "text-teal-600 dark:text-teal-400",
        iconBorderClass: "border-teal-100 dark:border-teal-500/10",
        iconName: "LayoutDashboard"
      }
    ];
    await Service.insertMany(services);
    console.log("Seeded services data.");

    // 5. Seed Tech Skills
    const techs = [
      { name: "Next.js", category: "frontend", iconName: "SiNextdotjs", hoverGlow: "hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:border-neutral-450 dark:hover:border-neutral-600" },
      { name: "ReactJS", category: "frontend", iconName: "SiReact", hoverGlow: "hover:shadow-[0_0_15px_rgba(97,218,251,0.15)] hover:border-[#61DAFB]/40" },
      { name: "TypeScript", category: "frontend", iconName: "SiTypescript", hoverGlow: "hover:shadow-[0_0_15px_rgba(49,120,198,0.15)] hover:border-[#3178C6]/40" },
      { name: "Redux", category: "frontend", iconName: "SiRedux", hoverGlow: "hover:shadow-[0_0_15px_rgba(118,74,188,0.15)] hover:border-[#764ABC]/40" },
      { name: "Redux Toolkit", category: "frontend", iconName: "SiRedux", hoverGlow: "hover:shadow-[0_0_15px_rgba(118,74,188,0.15)] hover:border-[#764ABC]/40" },
      { name: "JavaScript", category: "frontend", iconName: "SiJavascript", hoverGlow: "hover:shadow-[0_0_15px_rgba(247,223,30,0.15)] hover:border-[#F7DF1E]/40" },
      { name: "Tailwind CSS", category: "frontend", iconName: "SiTailwindcss", hoverGlow: "hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:border-[#06B6D4]/40" },
      { name: "shadcn", category: "frontend", iconName: "SiShadcnui", hoverGlow: "hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:border-neutral-450 dark:hover:border-neutral-600" },
      { name: "HTML5", category: "frontend", iconName: "SiHtml5", hoverGlow: "hover:shadow-[0_0_15px_rgba(227,79,38,0.15)] hover:border-[#E34F26]/40" },
      { name: "CSS3", category: "frontend", iconName: "SiCss", hoverGlow: "hover:shadow-[0_0_15px_rgba(21,114,182,0.15)] hover:border-[#1572B6]/40" },
      { name: "Bootstrap 4/5", category: "frontend", iconName: "SiBootstrap", hoverGlow: "hover:shadow-[0_0_15px_rgba(121,82,179,0.15)] hover:border-[#7952B3]/40" },
      { name: "Node.js (Fam.)", category: "backend", iconName: "SiNodedotjs", hoverGlow: "hover:shadow-[0_0_15px_rgba(51,153,51,0.15)] hover:border-[#339933]/40" },
      { name: "Strapi CMS", category: "backend", iconName: "SiStrapi", hoverGlow: "hover:shadow-[0_0_15px_rgba(73,69,255,0.15)] hover:border-[#4945FF]/40" },
      { name: "WebSockets", category: "backend", iconName: "SiSocketdotio", hoverGlow: "hover:shadow-[0_0_15px_rgba(37,99,235,0.15)] hover:border-[#2563EB]/40" },
      { name: "Express.js", category: "backend", iconName: "SiExpress", hoverGlow: "hover:shadow-[0_0_15px_rgba(100,100,100,0.15)] hover:border-neutral-500" },
      { name: "REST APIs", category: "backend", iconName: "TbApi", hoverGlow: "hover:shadow-[0_0_15px_rgba(225,29,72,0.15)] hover:border-[#E11D48]/40" },
      { name: "MongoDB", category: "databases", iconName: "SiMongodb", hoverGlow: "hover:shadow-[0_0_15px_rgba(71,162,72,0.15)] hover:border-[#47A248]/40" },
      { name: "MySQL", category: "databases", iconName: "SiMysql", hoverGlow: "hover:shadow-[0_0_15px_rgba(0,117,143,0.15)] hover:border-[#00758F]/40" },
      { name: "Redis", category: "databases", iconName: "SiRedis", hoverGlow: "hover:shadow-[0_0_15px_rgba(220,56,45,0.15)] hover:border-[#DC382D]/40" },
      { name: "Git", category: "tools", iconName: "SiGit", hoverGlow: "hover:shadow-[0_0_15px_rgba(240,80,50,0.15)] hover:border-[#F05032]/40" },
      { name: "GitHub", category: "tools", iconName: "SiGithub", hoverGlow: "hover:shadow-[0_0_15px_rgba(255,255,255,0.25)] hover:border-neutral-500" },
      { name: "Postman", category: "tools", iconName: "SiPostman", hoverGlow: "hover:shadow-[0_0_15px_rgba(255,108,55,0.15)] hover:border-[#FF6C37]/40" },
      { name: "Thunder Client", category: "tools", iconName: "TbBolt", hoverGlow: "hover:shadow-[0_0_15px_rgba(124,58,237,0.15)] hover:border-[#7C3AED]/40" },
      { name: "Vite", category: "tools", iconName: "SiVite", hoverGlow: "hover:shadow-[0_0_15px_rgba(189,52,254,0.15)] hover:border-[#BD34FE]/40" }
    ];
    await Tech.insertMany(techs);
    console.log("Seeded tech skills data.");

    // 6. Seed Experiences
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
    await Experience.insertMany(experiences);
    console.log("Seeded experiences data.");

    // 7. Seed Testimonials
    const testimonials = [
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
      }
    ];
    await Testimonial.insertMany(testimonials);
    console.log("Seeded testimonials data.");

    // 8. Seed Social Links
    const defaultSocials = [
      { name: "LinkedIn", link: "https://www.linkedin.com/in/ganpatkoli/" },
      { name: "GitHub", link: "https://github.com/ganpatkoli" },
      { name: "Twitter", link: "https://twitter.com/ganpatkoli" },
      { name: "Email", link: "mailto:ganpatkoli.dev@gmail.com" },
      { name: "Upwork", link: "https://www.upwork.com/" },
      { name: "Fiverr", link: "https://www.fiverr.com/" }
    ];
    await Social.insertMany(defaultSocials);
    console.log("Seeded default social links data.");

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Database seeding failed:", error);
    process.exit(1);
  }
};

seedData();
