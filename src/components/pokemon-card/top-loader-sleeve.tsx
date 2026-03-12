"use client";

import { motion } from "framer-motion";
import { useTilt } from "@/hooks/use-tilt";
import "./pokemon-card.css";

interface TopLoaderSleeveProps {
  children: React.ReactNode;
}

export function TopLoaderSleeve({ children }: TopLoaderSleeveProps) {
  const { ref: sleeveRef, rotateX, rotateY, handleMouseMove, handleMouseLeave } = useTilt({ maxTilt: 15 });

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
