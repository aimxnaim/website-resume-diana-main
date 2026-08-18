import React from "react";

import styles from "./ProjectCard.module.css";
import { PixelFrame } from "../PixelFrame/PixelFrame";
import { useReveal } from "../../hooks/useReveal";
import { getImageUrl } from "../../utils";

export const ProjectCard = ({
  project: { title, imageSrc, description, skills },
  index = 0,
}) => {
  const [ref, inView] = useReveal();

  return (
    <div
      ref={ref}
      className={`reveal ${inView ? "in-view" : ""}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <PixelFrame className={styles.card} innerClassName={styles.inner}>
        <div className={styles.shot}>
          <img src={getImageUrl(imageSrc)} alt={`Screenshot of ${title}`} />
        </div>
        <div className={styles.body}>
          <h3 className={styles.title}>{title.trim()}</h3>
          <p className={styles.description}>{description.trim()}</p>
          <ul className={styles.skills}>
            {skills.map((skill, id) => (
              <li key={id} className="tag">
                {skill.trim()}
              </li>
            ))}
          </ul>
        </div>
      </PixelFrame>
    </div>
  );
};
