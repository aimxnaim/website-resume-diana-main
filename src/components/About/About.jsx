import React from "react";

import styles from "./About.module.css";
import { PixelFrame } from "../PixelFrame/PixelFrame";
import { Terminal } from "../Terminal/Terminal";
import { useReveal } from "../../hooks/useReveal";
import { getImageUrl } from "../../utils";

const TERMINAL_LINES = [
  {
    prompt: "$ whoami",
    result: "Nordiana Sahira — Data Analyst, Iskandar Puteri",
  },
  {
    prompt: "$ focus",
    result: "data analysis · validation · reporting · dashboards",
  },
  {
    prompt: "$ experience",
    result: "3 roles across government technology projects",
  },
  {
    prompt: "$ now",
    result: "SHTJ · JohorPay · Bantuan Kasih Johor",
  },
];

const EDUCATION = [
  {
    icon: "about/serverIcon.png",
    alt: "Server icon",
    school: "University Of Technology MARA, Jasin",
    detail:
      "Bachelor of Information Systems (Hons.) Information Systems Engineering — CGPA : 3.17",
  },
  {
    icon: "about/uiIcon.png",
    alt: "UI icon",
    school: "University Of Technology MARA, Jasin",
    detail: "Diploma in Computer Science — CGPA : 3.40",
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
            I work where data meets delivery. Day to day that means extracting,
            cleaning and transforming datasets from multiple sources, hunting
            down inconsistencies, and turning what I find into summaries,
            reports and dashboards that managers can actually decide on. The
            other half of the job is getting systems live — coordinating Sprint,
            SIT, UAT, FAT and data migration with vendors and end users so
            releases land on time and on scope.
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
