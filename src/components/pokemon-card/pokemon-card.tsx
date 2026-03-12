"use client";

import { useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import "./pokemon-card.css";

interface PokemonCardProps {
  cardImage: string;
  cardName: string;
}

export function PokemonCard({ cardImage, cardName }: PokemonCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    cardRef.current.style.setProperty("--x", `${xPct}%`);
    cardRef.current.style.setProperty("--y", `${yPct}%`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.style.setProperty("--x", "50%");
      cardRef.current.style.setProperty("--y", "50%");
    }
  }, []);

  return (
    <div
      ref={cardRef}
      className="pokemon-card-wrapper"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Image
        src={cardImage}
        alt={cardName}
        width={260}
        height={364}
        className="rounded-xl"
        unoptimized
      />
      <div className="pokemon-card__softlight" />
      <div className="pokemon-card__holo" />
      <div className="pokemon-card__shine" />
    </div>
  );
}
