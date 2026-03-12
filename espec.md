# 3D Pokemon Card Animations - Research & Implementation Plan

## Overview

This document covers the best approaches for creating 3D Pokemon card animations in a Next.js/React project, including holographic effects, mouse-tracking tilt, card sleeve/top loader effects, and Framer Motion integration.

---

## 1. 3D Card Flip/Tilt Animations

### Approach A: Pure CSS + Vanilla JS (No Library)

The simplest and most performant approach. Based on the technique from [ibelick.com](https://ibelick.com/blog/create-tilt-effect-with-react):

```tsx
import { useState, MouseEvent, useCallback } from "react";

function throttle<T extends (...args: any[]) => any>(func: T, delay: number) {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = new Date().getTime();
    if (now - lastCall < delay) return;
    lastCall = now;
    return func(...args);
  };
}

export const PokemonCard3D = () => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const onMouseMove = useCallback(
    throttle((e: MouseEvent<HTMLDivElement>) => {
      const card = e.currentTarget;
      const box = card.getBoundingClientRect();
      const x = e.clientX - box.left;
      const y = e.clientY - box.top;
      const centerX = box.width / 2;
      const centerY = box.height / 2;
      const rotateX = (y - centerY) / 7;   // Adjust divisor for intensity
      const rotateY = (centerX - x) / 7;
      setRotate({ x: rotateX, y: rotateY });
    }, 100),
    []
  );

  const onMouseLeave = () => setRotate({ x: 0, y: 0 });

  return (
    <div
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1, 1, 1)`,
        transition: "all 400ms cubic-bezier(0.03, 0.98, 0.52, 0.99) 0s",
      }}
    >
      {/* Card content */}
    </div>
  );
};
```

**Key CSS properties:**
- `perspective: 1000px` -- creates the 3D depth (lower = more extreme)
- `rotateX` / `rotateY` -- tilt based on mouse offset from center
- `transform-style: preserve-3d` -- enables child elements to exist in 3D space
- `backface-visibility: hidden` -- hides the back face during flips
- `transition: cubic-bezier(0.03, 0.98, 0.52, 0.99)` -- smooth spring-like easing

### Approach B: Framer Motion (Recommended for Next.js)

Based on [arielbk's shiny-3d-card](https://github.com/arielbk/shiny-3d-card):

```tsx
"use client";
import { motion, useMotionValue, useTransform, useMotionTemplate, animate } from "framer-motion";
import { useEffect, useRef } from "react";

const DAMPEN = 40; // Higher = less rotation

export function HolographicCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== "undefined" ? window.innerHeight / 2 : 0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      animate(mouseX, e.clientX);  // Animated (smooth) tracking
      animate(mouseY, e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Transform mouse position to rotation degrees
  const rotateX = useTransform<number, number>(mouseY, (newMouseY) => {
    if (!cardRef.current) return 0;
    const rect = cardRef.current.getBoundingClientRect();
    return -(newMouseY - rect.top - rect.height / 2) / DAMPEN;
  });

  const rotateY = useTransform(mouseX, (newMouseX) => {
    if (!cardRef.current) return 0;
    const rect = cardRef.current.getBoundingClientRect();
    return (newMouseX - rect.left - rect.width / 2) / DAMPEN;
  });

  // Sheen/shine gradient that follows tilt
  const diagonalMovement = useTransform<number, number>(
    [rotateX, rotateY],
    ([newRotateX, newRotateY]) => newRotateX + newRotateY
  );
  const sheenPosition = useTransform(diagonalMovement, [-5, 5], [-100, 200]);
  const sheenOpacity = useTransform(sheenPosition, [-100, 50, 200], [0, 0.05, 0]);
  const sheenGradient = useMotionTemplate`linear-gradient(
    55deg, transparent, rgba(255 255 255 / ${sheenOpacity}) ${sheenPosition}%, transparent
  )`;

  return (
    <div style={{ perspective: "1000px" }}>
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <motion.div
          ref={cardRef}
          style={{
            width: 300,
            height: 420,
            borderRadius: 20,
            backgroundImage: sheenGradient,
            backdropFilter: "blur(3px) brightness(120%)",
          }}
        >
          {/* Pokemon card image */}
        </motion.div>
      </motion.div>
    </div>
  );
}
```

### Approach C: Library-Based (react-next-tilt / vanilla-tilt)

**react-next-tilt** (designed for Next.js):
```bash
npm install react-next-tilt
```
```tsx
import { Tilt } from "react-next-tilt";

<Tilt
  tiltMaxAngleX={15}
  tiltMaxAngleY={15}
  perspective={1000}
  scale={1.05}
  transitionSpeed={400}
  glareEnable={true}
  glareMaxOpacity={0.3}
  glareBorderRadius="12px"
>
  <img src="/pokemon-card.png" alt="Pokemon Card" />
</Tilt>
```

**react-parallax-tilt** (popular alternative):
```bash
npm install react-parallax-tilt
```
```tsx
import Tilt from "react-parallax-tilt";

<Tilt
  tiltMaxAngleX={20}
  tiltMaxAngleY={20}
  perspective={800}
  scale={1.05}
  transitionSpeed={2000}
  glareEnable={true}
  glareMaxOpacity={0.45}
  glarePosition="all"
  glareBorderRadius="12px"
>
  <div className="pokemon-card">...</div>
</Tilt>
```

**Recommendation:** Use Framer Motion (Approach B) for maximum control and integration with Next.js, or react-parallax-tilt for quick setup.

---

## 2. Holographic/Shine Effects

### The simeydotme Approach (Gold Standard)

The [pokemon-cards-css](https://github.com/simeydotme/pokemon-cards-css) project by Simon Goellner is the definitive reference. It uses:

- **CSS Transforms + Gradients + Blend Modes + Filters**
- **CSS custom properties** for mouse position tracking (`--x`, `--y`)
- **Multiple layered pseudo-elements** for different holo effects

### Soft Spotlight Effect (from chiubaca.com)

```css
.card {
  position: relative;
  height: 420px;
  width: 300px;
  border-radius: 12px;
  overflow: hidden;
}

.card__softlight {
  position: absolute;
  inset: 0;
  mix-blend-mode: soft-light;
  background: radial-gradient(
    farthest-corner circle at var(--x, 50%) var(--y, 50%),
    rgba(255, 255, 255, 0.8) 10%,
    rgba(255, 255, 255, 0.65) 20%,
    rgba(255, 255, 255, 0) 90%
  );
}
```

```tsx
// React version of the mouse tracking
const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  const card = e.currentTarget;
  const { width, height, left, top } = card.getBoundingClientRect();
  const x = ((e.clientX - left) / width) * 100;
  const y = ((e.clientY - top) / height) * 100;
  card.style.setProperty("--x", `${x}%`);
  card.style.setProperty("--y", `${y}%`);
};
```

### Rainbow Holographic Layer

```css
.card__holo {
  position: absolute;
  inset: 0;
  mix-blend-mode: color-dodge;
  opacity: 0;
  transition: opacity 0.3s ease;
  background: linear-gradient(
    115deg,
    transparent 20%,
    rgba(255, 219, 112, 0.4) 36%,
    rgba(255, 182, 193, 0.4) 43%,
    rgba(173, 216, 230, 0.4) 50%,
    rgba(152, 251, 152, 0.4) 57%,
    rgba(221, 160, 221, 0.4) 64%,
    transparent 80%
  );
  background-size: 150% 150%;
  background-position: var(--x, 50%) var(--y, 50%);
  filter: brightness(0.7) contrast(2.5);
}

.card:hover .card__holo {
  opacity: 0.7;
}
```

### Full Holographic Card Component

```tsx
"use client";
import { useRef, useState } from "react";

export function HolographicPokemonCard({ imageSrc }: { imageSrc: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({
    "--x": "50%",
    "--y": "50%",
    "--rx": "0deg",
    "--ry": "0deg",
  } as React.CSSProperties);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const { width, height, left, top } = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    const rx = ((y - 50) / 50) * -10;  // max 10deg
    const ry = ((x - 50) / 50) * 10;
    setStyle({
      "--x": `${x}%`,
      "--y": `${y}%`,
      "--rx": `${rx}deg`,
      "--ry": `${ry}deg`,
    } as React.CSSProperties);
  };

  const handleMouseLeave = () => {
    setStyle({
      "--x": "50%",
      "--y": "50%",
      "--rx": "0deg",
      "--ry": "0deg",
    } as React.CSSProperties);
  };

  return (
    <div
      ref={cardRef}
      className="pokemon-card"
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <img src={imageSrc} alt="Pokemon Card" />
      <div className="card__softlight" />
      <div className="card__holo" />
      <div className="card__shine" />
    </div>
  );
}
```

CSS:
```css
.pokemon-card {
  position: relative;
  width: 300px;
  height: 420px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transform: perspective(800px) rotateX(var(--rx)) rotateY(var(--ry));
  transition: transform 0.4s cubic-bezier(0.03, 0.98, 0.52, 0.99);
  will-change: transform;
}

.pokemon-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

.card__softlight {
  position: absolute;
  inset: 0;
  mix-blend-mode: soft-light;
  background: radial-gradient(
    farthest-corner circle at var(--x) var(--y),
    rgba(255, 255, 255, 0.8) 10%,
    rgba(255, 255, 255, 0.65) 20%,
    rgba(255, 255, 255, 0) 90%
  );
  pointer-events: none;
}

.card__holo {
  position: absolute;
  inset: 0;
  mix-blend-mode: color-dodge;
  opacity: 0;
  transition: opacity 0.3s ease;
  background: linear-gradient(
    115deg,
    transparent 20%,
    rgba(255, 219, 112, 0.4) 36%,
    rgba(255, 182, 193, 0.4) 43%,
    rgba(173, 216, 230, 0.4) 50%,
    rgba(152, 251, 152, 0.4) 57%,
    rgba(221, 160, 221, 0.4) 64%,
    transparent 80%
  );
  background-size: 150% 150%;
  background-position: var(--x) var(--y);
  filter: brightness(0.7) contrast(2.5);
  pointer-events: none;
}

.pokemon-card:hover .card__holo {
  opacity: 0.7;
}

.card__shine {
  position: absolute;
  inset: 0;
  mix-blend-mode: overlay;
  opacity: 0;
  transition: opacity 0.3s ease;
  background: radial-gradient(
    farthest-corner circle at var(--x) var(--y),
    rgba(255, 255, 255, 0.5) 0%,
    rgba(255, 255, 255, 0.2) 30%,
    transparent 70%
  );
  pointer-events: none;
}

.pokemon-card:hover .card__shine {
  opacity: 1;
}
```

---

## 3. Card in Sleeve / Top Loader Effect

### Concept

Create a transparent "top loader" container that wraps the card with:
- Glassmorphism for the plastic/acrylic look
- Subtle border highlights for edge reflections
- Inner shadow for depth where card sits
- A separate glare layer on the sleeve itself

### Implementation

```tsx
"use client";

export function CardInTopLoader({ children }: { children: React.ReactNode }) {
  return (
    <div className="toploader-container">
      {/* The card sits inside */}
      <div className="toploader-card">
        {children}
      </div>

      {/* The top loader / sleeve overlay */}
      <div className="toploader-sleeve" />

      {/* Glare on the sleeve surface */}
      <div className="toploader-glare" />
    </div>
  );
}
```

```css
.toploader-container {
  position: relative;
  width: 320px;       /* slightly larger than card */
  height: 450px;
  border-radius: 8px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* The card inside the sleeve */
.toploader-card {
  position: relative;
  z-index: 1;
  border-radius: 8px;
  /* Slight shadow to show the card "sits" inside */
  filter: brightness(0.97);
}

/* The transparent sleeve/top loader */
.toploader-sleeve {
  position: absolute;
  inset: 0;
  z-index: 2;
  border-radius: 8px;
  pointer-events: none;

  /* Glassmorphism: transparent acrylic look */
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0.03) 50%,
    rgba(255, 255, 255, 0.08) 100%
  );
  backdrop-filter: blur(0.5px);          /* very subtle blur */

  /* Edge highlights mimicking plastic edges */
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow:
    inset 0 0 20px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 4px 16px rgba(0, 0, 0, 0.15),
    0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Glare across the sleeve surface */
.toploader-glare {
  position: absolute;
  inset: 0;
  z-index: 3;
  border-radius: 8px;
  pointer-events: none;
  background: linear-gradient(
    105deg,
    transparent 40%,
    rgba(255, 255, 255, 0.12) 45%,
    rgba(255, 255, 255, 0.06) 50%,
    transparent 55%
  );
  /* Animate the glare position on hover */
  transition: background-position 0.5s ease;
  background-size: 200% 200%;
  background-position: 100% 0%;
}

.toploader-container:hover .toploader-glare {
  background-position: 0% 100%;
}

/* Optional: top opening of the top loader */
.toploader-sleeve::before {
  content: "";
  position: absolute;
  top: -2px;
  left: 15%;
  right: 15%;
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0 0 4px 4px;
}
```

### Advanced: Mouse-Responsive Sleeve Glare

```tsx
const handleMouseMove = (e: React.MouseEvent) => {
  const el = e.currentTarget as HTMLElement;
  const { left, top, width, height } = el.getBoundingClientRect();
  const x = ((e.clientX - left) / width) * 100;
  const y = ((e.clientY - top) / height) * 100;

  // Move the glare highlight to follow cursor
  el.style.setProperty("--glare-x", `${x}%`);
  el.style.setProperty("--glare-y", `${y}%`);
};
```

```css
.toploader-glare {
  background: radial-gradient(
    ellipse at var(--glare-x, 50%) var(--glare-y, 30%),
    rgba(255, 255, 255, 0.15) 0%,
    rgba(255, 255, 255, 0.05) 30%,
    transparent 60%
  );
}
```

---

## 4. Framer Motion for 3D Animations

### Card Flip Animation

```tsx
"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export function FlippableCard({ front, back }: { front: React.ReactNode; back: React.ReactNode }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      style={{ perspective: "1000px", width: 300, height: 420 }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 60, damping: 15 }}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
        }}
      >
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            borderRadius: 12,
          }}
        >
          {front}
        </motion.div>
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: 12,
          }}
        >
          {back}
        </motion.div>
      </motion.div>
    </div>
  );
}
```

### Gesture-Based 3D Tilt with Spring

```tsx
"use client";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

export function GestureTiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Transform mouse position to rotation (spring-dampened)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), {
    stiffness: 150,
    damping: 20,
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const xPos = (e.clientX - rect.left) / rect.width - 0.5;
    const yPos = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPos);
    y.set(yPos);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 800,
        width: 300,
        height: 420,
        borderRadius: 12,
      }}
      whileHover={{ scale: 1.05 }}
      transition={{ scale: { type: "spring", stiffness: 300, damping: 20 } }}
    >
      {children}
    </motion.div>
  );
}
```

### Spring Configurations Cheat Sheet

```tsx
// Bouncy, playful (card reveal)
{ type: "spring", stiffness: 100, damping: 10 }

// Smooth, premium (tilt response)
{ type: "spring", stiffness: 150, damping: 20 }

// Snappy, immediate (button press)
{ type: "spring", stiffness: 400, damping: 30 }

// Slow, dramatic (page transition)
{ type: "spring", stiffness: 60, damping: 15 }

// Framer Motion presets
{ type: "spring", bounce: 0.25 }  // 0 = no bounce, 1 = max bounce
```

---

## 5. Putting It All Together: Full Premium Pokemon Card Component

### Recommended Architecture

```
components/
  pokemon-card/
    PokemonCard.tsx          -- Main wrapper with tilt
    HolographicOverlay.tsx   -- Holo rainbow + shine layers
    TopLoaderSleeve.tsx      -- Transparent sleeve overlay
    CardFlip.tsx             -- Flip animation wrapper
    pokemon-card.css         -- All card styles
```

### Dependencies

```bash
npm install framer-motion
# Optional:
npm install react-parallax-tilt  # For quick tilt without custom code
```

### Performance Tips

1. Use `will-change: transform` on animated elements
2. Use `pointer-events: none` on overlay layers
3. Throttle mouse move handlers (60fps max)
4. Use `useMotionValue` instead of React state for animation values (avoids re-renders)
5. Use `transform` instead of `top/left` for GPU acceleration
6. Keep `backdrop-filter` usage minimal (expensive on mobile)
7. Use `@media (prefers-reduced-motion: reduce)` to disable for accessibility

---

## 6. Key References

- [pokemon-cards-css by simeydotme](https://github.com/simeydotme/pokemon-cards-css) -- The gold standard for Pokemon card CSS effects
- [Live demo: poke-holo.simey.me](https://poke-holo.simey.me) -- Interactive demo of all holo effects
- [arielbk/shiny-3d-card](https://github.com/arielbk/shiny-3d-card) -- React + TS + Framer Motion implementation
- [3D shiny card tutorial (DEV)](https://dev.to/arielbk/how-to-make-a-3d-shiny-card-animation-react-ts-and-framer-motion-ijf)
- [Tiltable cards from scratch in React](https://stackrant.com/posts/tiltable-cards)
- [Custom tilt effect with React](https://ibelick.com/blog/create-tilt-effect-with-react)
- [Holographic card spotlight CSS tutorial](https://chiubaca.com/holograpic-cards-pt-1/)
- [Framer Motion card flip tutorial](https://dev.to/graciesharma/how-to-create-a-flipping-card-animation-using-framer-motion-5djh)
- [react-next-tilt NPM package](https://dev.to/rashidshamloo/react-next-tilt-and-react-flip-tilt-npm-packages-24p0)
- [react-parallax-tilt](https://www.npmjs.com/package/react-parallax-tilt)
- [vanilla-tilt.js](https://micku7zu.github.io/vanilla-tilt.js/)
- [Glassmorphism CSS Generator](https://css.glass/)
- [Framer Motion useTransform docs](https://www.framer.com/motion/use-transform/)
- [CodePen: Pokemon Card Holo Effect v2](https://codepen.io/simeydotme/pen/abYWJdX)
- [CodePen: 3D mouse tracking tilt](https://codepen.io/oscar-jite/pen/bGyLKXq)
