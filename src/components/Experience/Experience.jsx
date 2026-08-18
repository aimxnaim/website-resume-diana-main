import React from "react";

import styles from "./Experience.module.css";
import { PixelFrame } from "../PixelFrame/PixelFrame";
import { useReveal } from "../../hooks/useReveal";
import history from "../../data/history.json";
import { getImageUrl } from "../../utils";

const HistoryCard = ({ item }) => {
  const [ref, inView] = useReveal();

  return (
    <li ref={ref} className={`reveal ${inView ? "in-view" : ""}`}>
      <PixelFrame innerClassName={styles.card}>
        <div className={styles.cardHead}>
          <PixelFrame size="sm" innerClassName={styles.logo}>
            <img
              src={getImageUrl(item.imageSrc)}
              alt={`${item.organisation} logo`}
            />
          </PixelFrame>
          <div>
            <h3 className={styles.role}>{item.role}</h3>
            <p className={styles.org}>{item.organisation}</p>
            <span className={styles.dates}>
              {item.startDate.trim()} — {item.endDate.trim()}
            </span>
          </div>
        </div>

        <ul className={styles.bullets}>
          {item.experiences.map((experience, id) => (
            <li key={id} className={styles.bullet}>
              <span className={styles.marker} aria-hidden="true">
                ▸
              </span>
              <span>{experience.trim()}</span>
            </li>
          ))}
        </ul>
      </PixelFrame>
    </li>
  );
};

export const Experience = () => {
  const [headRef, headInView] = useReveal();

  return (
    <section className={styles.container} id="experience">
      <div
        ref={headRef}
        className={`section-head reveal ${headInView ? "in-view" : ""}`}
      >
        <div className="eyebrow">
          <span className="lv">LV.02</span> WHERE I&apos;VE WORKED
        </div>
        <h2>EXPERIENCE</h2>
      </div>

      <ul className={styles.history}>
        {history.map((item, id) => (
          <HistoryCard key={id} item={item} />
        ))}
      </ul>
    </section>
  );
};
