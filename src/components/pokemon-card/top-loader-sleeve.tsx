"use client";

import { useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import "./pokemon-card.css";

interface TopLoaderSleeveProps {
  children: React.ReactNode;
}

export function TopLoaderSleeve({ children }: TopLoaderSleeveProps) {
  const sleeveRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), {
    stiffness: 150,
    damping: 20,
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!sleeveRef.current) return;
      const rect = sleeveRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);

      const xPct = ((e.clientX - rect.left) / rect.width) * 100;
      const yPct = ((e.clientY - rect.top) / rect.height) * 100;
      sleeveRef.current.style.setProperty("--glare-x", `${xPct}%`);
      sleeveRef.current.style.setProperty("--glare-y", `${yPct}%`);
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    if (sleeveRef.current) {
      sleeveRef.current.style.setProperty("--glare-x", "50%");
      sleeveRef.current.style.setProperty("--glare-y", "30%");
    }
  }, [mouseX, mouseY]);

  return (
    <div style={{ perspective: "800px" }}>
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ scale: 1.03 }}
        transition={{ scale: { type: "spring", stiffness: 300, damping: 20 } }}
      >
        <div
          ref={sleeveRef}
          className="toploader"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Card inside */}
          {children}

          {/* Sleeve overlay */}
          <div className="toploader__sleeve" />

          {/* Glare */}
          <div className="toploader__glare" />

          {/* Light streak */}
          <div className="toploader__streak" />
        </div>
      </motion.div>
    </div>
  );
}
