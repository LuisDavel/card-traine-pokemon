"use client";

import { useRef, useCallback, type CSSProperties } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import "./trainer-card.css";

interface TrainerCardProps {
  trainerName: string;
  avatarUrl?: string | null;
  favoriteType?: string | null;
  city?: string | null;
  badges?: string[] | null;
  username: string;
}

const TYPE_COLORS: Record<string, { main: string; dark: string }> = {
  fire: { main: "#F08030", dark: "#c0642a" },
  water: { main: "#6890F0", dark: "#4a6fc0" },
  grass: { main: "#78C850", dark: "#5a9a3a" },
  electric: { main: "#F8D030", dark: "#c4a020" },
  psychic: { main: "#F85888", dark: "#c44068" },
  ice: { main: "#98D8D8", dark: "#70b0b0" },
  dragon: { main: "#7038F8", dark: "#5828c0" },
  dark: { main: "#705848", dark: "#584038" },
  fairy: { main: "#EE99AC", dark: "#c07088" },
  normal: { main: "#A8A878", dark: "#888860" },
  fighting: { main: "#C03028", dark: "#982018" },
  poison: { main: "#A040A0", dark: "#803080" },
  ground: { main: "#E0C068", dark: "#b09848" },
  flying: { main: "#A890F0", dark: "#8070c0" },
  bug: { main: "#A8B820", dark: "#889018" },
  rock: { main: "#B8A038", dark: "#988028" },
  ghost: { main: "#705898", dark: "#584078" },
  steel: { main: "#B8B8D0", dark: "#9898b0" },
};

const TYPE_LABELS: Record<string, string> = {
  fire: "Fogo",
  water: "Agua",
  grass: "Planta",
  electric: "Eletrico",
  psychic: "Psiquico",
  ice: "Gelo",
  dragon: "Dragao",
  dark: "Sombrio",
  fairy: "Fada",
  normal: "Normal",
  fighting: "Lutador",
  poison: "Veneno",
  ground: "Terra",
  flying: "Voador",
  bug: "Inseto",
  rock: "Pedra",
  ghost: "Fantasma",
  steel: "Metal",
};

export function TrainerCard({
  trainerName,
  avatarUrl,
  favoriteType,
  city,
  badges,
  username,
}: TrainerCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), {
    stiffness: 150,
    damping: 20,
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);

      const xPct = ((e.clientX - rect.left) / rect.width) * 100;
      const yPct = ((e.clientY - rect.top) / rect.height) * 100;
      cardRef.current.style.setProperty("--x", `${xPct}%`);
      cardRef.current.style.setProperty("--y", `${yPct}%`);
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    if (cardRef.current) {
      cardRef.current.style.setProperty("--x", "50%");
      cardRef.current.style.setProperty("--y", "50%");
    }
  }, [mouseX, mouseY]);

  const typeColors = favoriteType
    ? TYPE_COLORS[favoriteType] || { main: "#F8D030", dark: "#c4a020" }
    : { main: "#F8D030", dark: "#c4a020" };

  const badgeCount = badges?.length ?? 0;
  const typeLabel = favoriteType
    ? TYPE_LABELS[favoriteType] || favoriteType
    : null;

  return (
    <div className="trainer-card-lanyard">
      {/* Lanyard strap */}
      <div
        className="trainer-card-lanyard__strap"
        style={{ "--type-color": typeColors.main } as CSSProperties}
      />
      {/* Metal clip */}
      <div className="trainer-card-lanyard__clip" />

      {/* 3D wrapper */}
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
            ref={cardRef}
            className="trainer-card"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={
              {
                "--type-color": typeColors.main,
                "--type-color-dark": typeColors.dark,
              } as CSSProperties
            }
          >
            {/* Colored banner */}
            <div className="trainer-card__banner">
              <div className="trainer-card__label">Trainer ID</div>
            </div>

            {/* Avatar overlapping banner/body */}
            <div className="trainer-card__avatar-wrapper">
              <div className="trainer-card__avatar">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={trainerName} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-400 bg-gray-100">
                    {trainerName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* White body */}
            <div className="trainer-card__body">
              <div className="trainer-card__name">
                {trainerName}
              </div>

              <div className="trainer-card__username">@{username}</div>

              {city && <div className="trainer-card__city">{city}</div>}

              {/* Stats */}
              <div className="trainer-card__stats">
                <div className="trainer-card__stat">
                  <span className="trainer-card__stat-value">{badgeCount}</span>
                  <span className="trainer-card__stat-label">Insignias</span>
                </div>
                <div className="trainer-card__stat">
                  <span
                    className="trainer-card__stat-value"
                    style={{ color: typeColors.main }}
                  >
                    {typeLabel || "—"}
                  </span>
                  <span className="trainer-card__stat-label">Tipo</span>
                </div>
                <div className="trainer-card__stat">
                  <span className="trainer-card__stat-value">TCG</span>
                  <span className="trainer-card__stat-label">Liga</span>
                </div>
              </div>
            </div>

            {/* Holographic overlays */}
            <div className="trainer-card__softlight" />
            <div className="trainer-card__holo" />
            <div className="trainer-card__shine" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
