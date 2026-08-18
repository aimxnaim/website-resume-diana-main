import React from "react";

import styles from "./About.module.css";
import { PixelFrame } from "../PixelFrame/PixelFrame";
import { Terminal } from "../Terminal/Terminal";
import { useReveal } from "../../hooks/useReveal";
import { getImageUrl } from "../../utils";

const TERMINAL_LINES = [
  {
    prompt: "$ whoami",
    result: "Nordiana Sahira — Information Systems Engineering grad",
  },
  { prompt: "$ stack", result: "PHP · Laravel · Java · React · Python" },
  {
    prompt: "$ experience",
    result: "3 roles since 2021, 2 as tech intern",
  },
  {
    prompt: "$ focus",
    result: "PHP Laravel framework & system development",
  },
];

const EDUCATION = [
  {
    icon: "about/serverIcon.png",
    alt: "Server icon",
    school: "University Of Technology MARA, Jasin",
    detail:
      "Bachelor of Information Systems (Hons.) Information Systems Engineering — CGPA : 3.44",
  },
  {
    icon: "about/uiIcon.png",
    alt: "UI icon",
    school: "University Of Technology MARA, Jasin",
    detail: "Diploma in Computer Science — CGPA : 3.30",
  },
];

export const About = () => {
  const [ref, inView] = useReveal();

  return (
    <section className={styles.container} id="about">
      <div
        ref={ref}
        className={`${styles.grid} reveal ${inView ? "in-view" : ""}`}
      >
        <div className={styles.terminalCol}>
          <Terminal title="diana@portfolio: ~" lines={TERMINAL_LINES} />
        </div>

        <div className={styles.text}>
          <div className="eyebrow">
            <span className="lv">LV.01</span> ABOUT ME
          </div>
          <h2 className={styles.heading}>NICE TO MEET YOU.</h2>
          <p className={styles.intro}>
            Throughout my university studies, I have gained nearly 2 years of
            hands-on programming experience, particularly excelling in building
            websites from the ground up. My front-end skills include
            technologies such as CSS, Bootstrap, React.js, and Mobirise.
            Additionally, I possess back-end expertise in Node.js, Laravel,
            Laragon, and XAMPP, allowing me to build full-stack applications
            that are both dynamic and responsive.
          </p>

          <ul className={styles.education}>
            {EDUCATION.map((entry) => (
              <li key={entry.detail}>
                <PixelFrame size="sm" innerClassName={styles.eduCard}>
                  <PixelFrame size="sm" innerClassName={styles.eduIcon}>
                    <img src={getImageUrl(entry.icon)} alt={entry.alt} />
                  </PixelFrame>
                  <div>
                    <h3 className={styles.eduSchool}>{entry.school}</h3>
                    <p className={styles.eduDetail}>{entry.detail}</p>
                  </div>
                </PixelFrame>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
