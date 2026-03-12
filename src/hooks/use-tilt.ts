"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { useMotionValue, useSpring, useTransform } from "framer-motion";

interface UseTiltOptions {
  maxTilt?: number;
  springConfig?: { stiffness: number; damping: number };
}

export function useTilt({
  maxTilt = 12,
  springConfig = { stiffness: 150, damping: 20 },
}: UseTiltOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isGyro, setIsGyro] = useState(false);

  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [maxTilt, -maxTilt]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-maxTilt, maxTilt]),
    springConfig
  );

  // Mouse handlers
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isGyro || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);

      const xPct = ((e.clientX - rect.left) / rect.width) * 100;
      const yPct = ((e.clientY - rect.top) / rect.height) * 100;
      ref.current.style.setProperty("--x", `${xPct}%`);
      ref.current.style.setProperty("--y", `${yPct}%`);
      ref.current.style.setProperty("--glare-x", `${xPct}%`);
      ref.current.style.setProperty("--glare-y", `${yPct}%`);
    },
    [mouseX, mouseY, isGyro]
  );

  const handleMouseLeave = useCallback(() => {
    if (isGyro) return;
    mouseX.set(0);
    mouseY.set(0);
    if (ref.current) {
      ref.current.style.setProperty("--x", "50%");
      ref.current.style.setProperty("--y", "50%");
      ref.current.style.setProperty("--glare-x", "50%");
      ref.current.style.setProperty("--glare-y", "50%");
    }
  }, [mouseX, mouseY, isGyro]);

  // Gyroscope / DeviceOrientation
  useEffect(() => {
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (!isTouchDevice) return;

    let baselineBeta: number | null = null;
    let baselineGamma: number | null = null;

    function handleOrientation(e: DeviceOrientationEvent) {
      if (e.beta === null || e.gamma === null) return;

      // Set baseline on first reading so resting position = center
      if (baselineBeta === null) {
        baselineBeta = e.beta;
        baselineGamma = e.gamma;
      }

      // Delta from resting position, clamped to [-30, 30] degrees
      const deltaBeta = Math.max(-30, Math.min(30, e.beta - baselineBeta!));
      const deltaGamma = Math.max(-30, Math.min(30, e.gamma - baselineGamma!));

      // Normalize to [-0.5, 0.5]
      const normalizedY = deltaBeta / 60;
      const normalizedX = deltaGamma / 60;

      mouseX.set(normalizedX);
      mouseY.set(normalizedY);

      // Update CSS custom properties for holographic effects
      if (ref.current) {
        const xPct = (normalizedX + 0.5) * 100;
        const yPct = (normalizedY + 0.5) * 100;
        ref.current.style.setProperty("--x", `${xPct}%`);
        ref.current.style.setProperty("--y", `${yPct}%`);
        ref.current.style.setProperty("--glare-x", `${xPct}%`);
        ref.current.style.setProperty("--glare-y", `${yPct}%`);
      }

      if (!isGyro) setIsGyro(true);
    }

    // iOS 13+ requires permission request
    const doe = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };

    if (typeof doe.requestPermission === "function") {
      // We'll request on first touch
      function requestOnTouch() {
        doe.requestPermission!().then((permission) => {
          if (permission === "granted") {
            window.addEventListener("deviceorientation", handleOrientation);
          }
        });
        window.removeEventListener("touchstart", requestOnTouch);
      }
      window.addEventListener("touchstart", requestOnTouch, { once: true });

      return () => {
        window.removeEventListener("touchstart", requestOnTouch);
        window.removeEventListener("deviceorientation", handleOrientation);
      };
    } else {
      window.addEventListener("deviceorientation", handleOrientation);
      return () => {
        window.removeEventListener("deviceorientation", handleOrientation);
      };
    }
  }, [mouseX, mouseY, isGyro]);

  return {
    ref,
    rotateX,
    rotateY,
    handleMouseMove,
    handleMouseLeave,
  };
}
