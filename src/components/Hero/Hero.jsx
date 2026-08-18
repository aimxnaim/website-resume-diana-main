import React, { useEffect, useRef } from "react";

import styles from "./Hero.module.css";
import { PixelFrame } from "../PixelFrame/PixelFrame";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { getImageUrl } from "../../utils";

const STICKERS = [
  { label: "🐘 PHP", className: styles.s1 },
  { label: "🔷 LARAVEL", className: styles.s2 },
  { label: "⚛️ REACT", className: styles.s3 },
];

export const Hero = () => {
  const sectionRef = useRef(null);
  const tiltRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const tilt = tiltRef.current;

    if (!section || !tilt) return undefined;
    if (reducedMotion || !window.matchMedia("(hover: hover)").matches) {
      tilt.style.transform = "";
      return undefined;
    }

    const onMove = (event) => {
      const rect = section.getBoundingClientRect();
      const relX = (event.clientX - rect.left) / rect.width - 0.5;
      const relY = (event.clientY - rect.top) / rect.height - 0.5;
      tilt.style.transition = "none";
      tilt.style.transform = `rotateX(${relY * -10}deg) rotateY(${relX * 10}deg)`;
    };

    const onLeave = () => {
      tilt.style.transition = "transform 0.2s ease";
      tilt.style.transform = "rotateX(0deg) rotateY(0deg)";
    };

    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);

    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, [reducedMotion]);

  return (
    <section className={styles.container} id="hero" ref={sectionRef}>
      <div className={styles.grid}>
        <div className={styles.content}>
          <div className={styles.pressStart}>★ PRESS START ★</div>
          <h1 className={styles.title}>
            HI, I&apos;M <span className={styles.accent}>DIANA</span>.
            <br />I BUILD SYSTEMS
            <br />THAT SHIP.
          </h1>
          <p className={styles.description}>
            I&apos;m a recent graduate with a degree in Information Systems
            Engineering, passionate about systems and related fields. I have
            hands-on experience with programming languages such as Java, PHP,
            HTML, CSS, Python, and JavaScript. Additionally, I have a solid
            understanding of Laravel framework concepts and possess a strong
            skill set in system development programming and system
            documentation. With my knowledge and passion for these areas, I
            am well-equipped to contribute to projects that involve in PHP
            Laravel Framework and also system development.
          </p>
          <div className={styles.actions}>
            <a href="#projects" className="btn btn-primary">
              ▶ SEE MY WORK
            </a>
            <a href="#contact" className="btn btn-ghost">
              ✉ LET&apos;S TALK
            </a>
          </div>
        </div>

        <div className={styles.photoWrap}>
          <div className={styles.p1Tag}>P1</div>
          {STICKERS.map((sticker) => (
            <div
              key={sticker.label}
              className={`${styles.sticker} ${sticker.className}`}
            >
              {sticker.label}
            </div>
          ))}
          <div className={styles.tiltCard} ref={tiltRef}>
            <PixelFrame size="lg" innerClassName={styles.photoInner}>
              <img
                src={getImageUrl("hero/dianaprofile.png")}
                alt="Nordiana Sahira"
                className={styles.photo}
              />
            </PixelFrame>
          </div>
        </div>
      </div>
    </section>
  );
};
