"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * VideoScrollHero - A scroll-driven video scaling hero component.
 *
 * @param {string} videoSrc - URL or imported path to the video file.
 * @param {boolean} enableAnimations - Whether scroll-based scaling is enabled.
 * @param {string} className - Additional CSS classes.
 * @param {number} startScale - Initial scale of the video (0-1), grows to 1 on scroll.
 */
export function VideoScrollHero({
  videoSrc = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  enableAnimations = true,
  className = "",
  startScale = 0.25,
}) {
  const containerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const [scrollScale, setScrollScale] = useState(startScale);

  useEffect(() => {
    if (!enableAnimations || shouldReduceMotion) return;

    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = containerRef.current.offsetHeight;
      const windowHeight = window.innerHeight;

      // Calculate scroll progress based on container position
      const scrolled = Math.max(0, -rect.top);
      const maxScroll = containerHeight - windowHeight;
      const progress = Math.min(scrolled / maxScroll, 1);

      // Scale from startScale to 1
      const newScale = startScale + progress * (1 - startScale);
      setScrollScale(newScale);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial calculation

    return () => window.removeEventListener("scroll", handleScroll);
  }, [enableAnimations, shouldReduceMotion, startScale]);

  const shouldAnimate = enableAnimations && !shouldReduceMotion;

  return (
    <div className={`relative ${className}`}>
      {/* Hero Section with Video */}
      <div ref={containerRef} className="relative h-[200vh] bg-background">
        {/* Fixed Video Container */}
        <div className="sticky top-0 w-full h-screen flex items-center justify-center z-10">
          <div
            className="relative flex items-center justify-center will-change-transform w-full h-full"
            style={{
              transform: shouldAnimate ? `scale(${scrollScale})` : "scale(1)",
              transformOrigin: "center center",
            }}
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover shadow-2xl"
              style={{
                borderRadius: shouldAnimate ? `${(1 - scrollScale) * 3}rem` : "1rem",
              }}
            >
              <source src={videoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Video Overlay Content */}
            <motion.div
              className="absolute inset-0 bg-background/20 backdrop-blur-[1px] flex items-center justify-center"
              style={{
                borderRadius: shouldAnimate ? `${(1 - scrollScale) * 3}rem` : "1rem",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <div className="text-center text-white">
                <motion.h1
                  className="text-2xl md:text-4xl lg:text-6xl font-bold mb-4"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.8,
                    duration: 0.8,
                    type: "spring",
                    stiffness: 200,
                    damping: 25,
                  }}
                >
                  Scroll to Scale
                </motion.h1>
                <motion.p
                  className="text-sm md:text-lg lg:text-xl text-white/80 max-w-2xl px-4"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 1.0,
                    duration: 0.8,
                    type: "spring",
                    stiffness: 200,
                    damping: 25,
                  }}
                >
                  Watch as the video expands with your scroll
                </motion.p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
