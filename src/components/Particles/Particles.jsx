import React from "react";

import styles from "./Particles.module.css";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

const PARTICLES = [
  { left: "4%", color: "var(--color-yellow)", duration: "10s", delay: "0s" },
  { left: "14%", color: "var(--color-pink)", duration: "13s", delay: "2s" },
  { left: "24%", color: "var(--color-blue)", duration: "9s", delay: "4s" },
  { left: "38%", color: "var(--color-green)", duration: "12s", delay: "1s" },
  { left: "52%", color: "var(--color-yellow)", duration: "11s", delay: "5s" },
  { left: "66%", color: "var(--color-pink)", duration: "14s", delay: "3s" },
  { left: "78%", color: "var(--color-blue)", duration: "10s", delay: "6s" },
  { left: "88%", color: "var(--color-green)", duration: "13s", delay: "2.5s" },
  { left: "95%", color: "var(--color-yellow)", duration: "9s", delay: "4.5s" },
];

export const Particles = () => {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) return null;

  return (
    <div className={styles.field} aria-hidden="true">
      {PARTICLES.map((particle, id) => (
        <span
          key={id}
          className={styles.particle}
          style={{
            left: particle.left,
            background: particle.color,
            animationDuration: particle.duration,
            animationDelay: particle.delay,
          }}
        />
      ))}
    </div>
  );
};
