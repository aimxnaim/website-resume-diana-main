import React from "react";

import styles from "./Skills.module.css";
import { PixelFrame } from "../PixelFrame/PixelFrame";
import { useReveal } from "../../hooks/useReveal";
import skillGroups from "../../data/skillGroups.json";
import { getImageUrl } from "../../utils";

const SEGMENTS = 10;

const SkillGroup = ({ group }) => {
  const [ref, inView] = useReveal();

  return (
    <div
      ref={ref}
      className={`${styles.group} ${inView ? styles.inView : ""}`}
    >
      <div className={styles.meterRow}>
        <span className={styles.meterLabel}>{group.title}</span>
        <span className={styles.meterLevel}>LV.{group.level}</span>
      </div>

      <div className={styles.meterBar} aria-hidden="true">
        {Array.from({ length: SEGMENTS }, (_, id) => (
          <span
            key={id}
            className={`${styles.seg} ${
              id < group.level ? `${styles.filled} ${styles[group.accent]}` : ""
            }`}
            style={{ transitionDelay: `${id * 45}ms` }}
          />
        ))}
      </div>

      <div className={styles.chipRow}>
        {group.chips.map((chip) => (
          <span key={chip} className={`chip chip-${group.accent}`}>
            {chip}
          </span>
        ))}
      </div>

      <div className={styles.iconRow}>
        {group.icons.map((icon) => (
          <PixelFrame key={icon} size="sm" innerClassName={styles.icon}>
            <img src={getImageUrl(icon)} alt="" aria-hidden="true" />
          </PixelFrame>
        ))}
      </div>
    </div>
  );
};

export const Skills = () => {
  const [headRef, headInView] = useReveal();

  return (
    <section className={styles.container} id="skills">
      <div
        ref={headRef}
        className={`section-head reveal ${headInView ? "in-view" : ""}`}
      >
        <div className="eyebrow">
          <span className="lv">LV.04</span> MY TOOLBOX
        </div>
        <h2>STUFF I BUILD WITH</h2>
      </div>

      {skillGroups.map((group) => (
        <SkillGroup key={group.title} group={group} />
      ))}
    </section>
  );
};
