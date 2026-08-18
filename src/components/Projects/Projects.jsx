import React from "react";

import styles from "./Projects.module.css";
import { ProjectCard } from "./ProjectCard";
import { useReveal } from "../../hooks/useReveal";
import projects from "../../data/projects.json";

export const Projects = () => {
  const [headRef, headInView] = useReveal();

  return (
    <section className={styles.container} id="projects">
      <div
        ref={headRef}
        className={`section-head reveal ${headInView ? "in-view" : ""}`}
      >
        <div className="eyebrow">
          <span className="lv">LV.03</span> SELECTED WORK
        </div>
        <h2>THINGS I&apos;VE BUILT</h2>
      </div>

      <div className={styles.grid}>
        {projects.map((project, id) => (
          <ProjectCard key={id} project={project} index={id} />
        ))}
      </div>
    </section>
  );
};
