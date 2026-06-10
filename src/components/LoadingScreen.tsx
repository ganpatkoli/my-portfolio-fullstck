import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const words = [
  "Hello",      // English
  "Namaste",    // Hindi
  "Bonjour",    // French
  "Ciao",       // Italian
  "Konnichiwa", // Japanese
  "Welcome"     // Final Welcome
];

const WORD_INTERVAL = 750; // duration for each greeting in ms
const WELCOME_HOLD = 1500;  // how long to display the final "Welcome" in ms

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  // Cycle through the words
  useEffect(() => {
    if (index === words.length - 1) {
      // Hold "Welcome" a bit longer before exiting
      const timeout = setTimeout(() => {
        setIsExiting(true);
      }, WELCOME_HOLD);
      return () => clearTimeout(timeout);
    }

    const interval = setTimeout(() => {
      setIndex((prev) => prev + 1);
    }, WORD_INTERVAL);

    return () => clearTimeout(interval);
  }, [index]);

  // Animate progress percentage to match the word changes
  useEffect(() => {
    const totalDuration = (words.length - 1) * WORD_INTERVAL + (WELCOME_HOLD - 200); // Total time until Welcome exit starts
    const intervalTime = 30; // update frequency in ms
    const totalSteps = totalDuration / intervalTime;
    const increment = 100 / totalSteps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return Math.min(prev + increment, 100);
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // Handle completion when slide-up animation is done
  const handleAnimationComplete = () => {
    if (isExiting) {
      onComplete();
    }
  };

  return (
    <AnimatePresence mode="wait">
      {!isExiting && (
        <motion.div
          initial={{ y: 0 }}
          exit={{
            y: "-100vh",
            transition: {
              duration: 0.85,
              ease: [0.76, 0, 0.24, 1], // Premium cubic-bezier
              delay: 0.1
            }
          }}
          onAnimationComplete={handleAnimationComplete}
          className="fixed inset-0 z-[9999] flex flex-col justify-between p-10 bg-black text-white overflow-hidden select-none"
        >
          {/* Subtle Ambient Glowing Orbs */}
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-violet-600/[0.08] blur-[150px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-orange-600/[0.06] blur-[150px] pointer-events-none" />

          {/* Dotted Grid Background */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />



          {/* Middle Content - Word Transitions */}
          <div className="flex flex-col items-center justify-center relative z-10 grow">
            {/* Word container */}
            <div className="h-24 flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={words[index]}
                  initial={{ y: 90, opacity: 0, rotateX: -30 }}
                  animate={{ y: 0, opacity: 1, rotateX: 0 }}
                  exit={{ y: -90, opacity: 0, rotateX: 30 }}
                  transition={{
                    duration: 0.38,
                    ease: [0.215, 0.61, 0.355, 1.0] // Smooth easeOut
                  }}
                  className={`text-5xl sm:text-7xl font-black tracking-tight ${words[index] === "Welcome"
                    ? "text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-violet-500 to-indigo-500 font-sans shadow-glow"
                    : "text-white"
                    }`}
                  style={{ transformOrigin: "50% 50% -50px", perspective: "1000px" }}
                >
                  {words[index] === "Welcome" ? "Welcome." : `${words[index]}`}
                </motion.h1>
              </AnimatePresence>
            </div>

            {/* Glowing accent bar beneath welcome */}
            {words[index] === "Welcome" && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 120, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="h-[3px] bg-gradient-to-r from-orange-500 to-violet-500 rounded-full mt-2 shadow-[0_0_15px_rgba(139,92,246,0.5)]"
              />
            )}
          </div>

          {/* Bottom Info - Progress Tracker */}
          <div className="flex justify-between items-end z-10 w-full">
            {/* Dynamic loading state message */}
            <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono flex flex-col gap-1">
              <span className="text-neutral-400">Status</span>
              <span className="text-white font-medium">
                {progress < 40 ? "Initializing System..." : progress < 80 ? "Loading Assets..." : "Rendering Experience..."}
              </span>
            </div>

            {/* Glowing Percentage Counter */}
            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono">Progress</span>
              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500">
                {Math.round(progress).toString().padStart(3)}%
              </div>
            </div>
          </div>

          {/* Linear Progress Bar at the absolute bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-neutral-900 overflow-hidden">
            <motion.div
              style={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-orange-500 via-violet-600 to-indigo-600 shadow-[0_0_10px_rgba(249,115,22,0.5)]"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
