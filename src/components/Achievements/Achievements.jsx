import React, { useEffect, useState } from "react";

import styles from "./Achievements.module.css";
import { PixelFrame } from "../PixelFrame/PixelFrame";
import { useReveal } from "../../hooks/useReveal";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import achievements from "../../data/achievements.json";

const DURATION = 1100;

const AchievementCard = ({ item, index }) => {
  const [ref, inView] = useReveal();
  const reducedMotion = usePrefersReducedMotion();
  const [count, setCount] = useState(item.countTo ? 0 : null);

  useEffect(() => {
    if (!inView || !item.countTo || reducedMotion) return undefined;

    let frame = 0;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / DURATION, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.floor(eased * item.countTo));

      if (progress < 1) {
        frame = requestAnimationFrame(step);
      } else {
        setCount(item.countTo);
      }
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [inView, item.countTo, reducedMotion]);

  const shown =
    item.countTo && !reducedMotion && count !== null
      ? String(count)
      : item.value;

  return (
    <div
      ref={ref}
      className={`reveal ${inView ? "in-view" : ""}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <PixelFrame size="sm" innerClassName={styles.card}>
        <span className={styles.icon} aria-hidden="true">
          {item.icon}
        </span>
        <span className={`${styles.value} ${inView ? styles.pop : ""}`}>
          {shown}
        </span>
        <p className={styles.label}>{item.label}</p>
      </PixelFrame>
    </div>
  );
};

export const Achievements = () => {
  const [headRef, headInView] = useReveal();

  return (
    <section className={styles.container} id="achievements">
      <div
        ref={headRef}
        className={`section-head reveal ${headInView ? "in-view" : ""}`}
      >
        <div className="eyebrow">
          <span className="lv">★</span> ACHIEVEMENTS UNLOCKED
        </div>
        <h2>BY THE NUMBERS</h2>
      </div>

      <div className={styles.strip}>
        {achievements.map((item, id) => (
          <AchievementCard key={item.label} item={item} index={id} />
        ))}
      </div>
    </section>
  );
};
