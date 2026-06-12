import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Navbar } from "./components/Navbar";
import { LoadingScreen } from "./components/LoadingScreen";
import { HeroSection } from "./components/HeroSection";
import { ProjectsSection } from "./components/ProjectsSection";
import { ExperienceSection } from "./components/ExperienceSection";
import { ContactSection } from "./components/ContactSection";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { ServicesSection } from "./components/ServicesSection";
import { TechStackSection } from "./components/TechStackSection";
import { FollowerPointerCard } from "./components/ui/following-pointer";
import { BackgroundGraphics } from "./components/ui/background-graphics";
import { AdminPanel } from "./components/AdminPanel";
// import { StayConnectedSection } from "./components/StayConnectedSection";
// import { API_BASE } from "./lib/api";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // const [socials, setSocials] = useState<any[]>([]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add("dark");
    root.style.colorScheme = "dark";

    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handleLocationChange);

    // Fetch socials for footer
  //   fetch(`${API_BASE}/socials`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (Array.isArray(data)) {
  //         setSocials(data);
  //       }
  //     })
  //     .catch((err) => console.error("Failed to fetch socials in App:", err));

    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);


  const blogContent = {
    author: "Ganpat Koli",

  };


  const TitleComponent = ({
    title,
  }: {
    title: string;
  }) => (
    <div className="flex items-center space-x-2">
      <img
        src={"https://media.licdn.com/dms/image/v2/D4D03AQFs213p76ehSw/profile-displayphoto-shrink_800_800/B4DZR6E.LEHcAc-/0/1737214914514?e=1782345600&v=beta&t=XMDpN7S7RzIuJkCGTi_NeQVf2rDBW4J5dOiyenj0eEY"}
        height="20"
        width="20"
        alt="thumbnail"
        className="rounded-full border-2 border-white"
      />
      <p>{title}</p>
    </div>
  )

  if (currentPath === "/admin") {
    return <AdminPanel />;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      <FollowerPointerCard
        title={
          <TitleComponent
            title={blogContent.author}
          />
        }
      >




        <div className="relative min-h-screen w-full text-neutral-900 dark:text-neutral-100">

          {/* Global Animated Background Layer */}
          <BackgroundGraphics />

          {/* Floating Header Navbar */}
          <Navbar />

          {/* Main Single Page Sections */}
          <main className="w-full">
            {/* Home / Hero */}
            <HeroSection />

            {/* Services Section */}
            <ServicesSection />

            {/* Technical Skills Portfolio */}
            <TechStackSection />

            {/* Featured Projects Grid */}
            <ProjectsSection />

            {/* Scroll Linked Timeline for Experience */}
            <ExperienceSection />

            {/* Infinite Scroll Testimonials */}
            <TestimonialsSection />

            {/* Social Links Section */}
            {/* <StayConnectedSection /> */}

            {/* Available for Hire CTA */}
            {/* <FreelanceSection /> */}

            {/* Contact Us Form */}
            <ContactSection />
          </main>

          {/* Premium Footer */}
          <footer className="py-12  dark:bg-black border-t border-neutral-200 dark:border-neutral-900 text-center text-xs text-neutral-500">
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-center gap-4">
              <p>© {new Date().getFullYear()} Ganpat Koli. All rights reserved.</p>
              {/* {socials.length > 0 && (
                <p className="flex gap-4">
                  {socials.map((social) => (
                    <a
                      key={social._id}
                      href={social.link}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-neutral-800 dark:hover:text-white transition-colors"
                    >
                      {social.name}
                    </a>
                  ))}
                </p>
              )} */}
            </div>
          </footer>



        </div >
      </FollowerPointerCard>
    </>
  );
}

export default App;
