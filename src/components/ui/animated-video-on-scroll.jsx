import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export function AnimatedVideoOnScroll({ videoSrc }) {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const scale = useTransform(scrollYProgress, [1, 0], [0.6, 1]);
  const y = useTransform(scrollYProgress, [1, 0], ["0%", "0%"]);
  const borderRadius = useTransform(
    scrollYProgress,
    [1, 0],
    ["4px", "0px"]
  );

  return (
    <section ref={containerRef} className="relative h-[300vh] w-full">

      <div className="sticky top-0 h-screen w-screen overflow-hidden">

        <motion.div
          style={{ scale, y, borderRadius }}
          className="absolute inset-0 overflow-hidden bg-black"
        >
          <video
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            controls
          className="w-full h-full object-cover  "
          />
        </motion.div>

      </div>

    </section>
  );
}
