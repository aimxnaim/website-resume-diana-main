import React from "react";
import styles from "./Experience.module.css";
import skills from "../../data/skills.json";
import history from "../../data/history.json";
import { getImageUrl } from "../../utils";

export const Experience = () => {
  return (
    <section className={styles.container} id="experience">
      <h2 className={styles.title}>Experience</h2>

      <div className={styles.content}>
        
        {/* History section placed above */}
        <ul className={styles.history}>
          {history.map((historyItem, id) => {
            return (
              <li key={id} className={styles.historyItem}>
                <img
                  src={getImageUrl(historyItem.imageSrc)}
                  alt={`${historyItem.organisation} Logo`}
                  style={{ width: "122px", marginTop: "15px", marginRight: "12px" }}
                />
                <div className={styles.historyItemDetails}>
                  <h3>{`${historyItem.role}, ${historyItem.organisation}`}</h3>
                  <p>{`${historyItem.startDate} - ${historyItem.endDate}`}</p>
                  <ul className={styles.noListStyle}>
                    {historyItem.experiences.map((experience, id) => {
                      return (
                        <li key={id} className={`${styles.justifyText} ${styles.listItem}`}>
                          <svg
                            className={styles.centerSvg}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="#FFFFFF"
                            width="28"
                            height="28"
                          >
                            <path d="m20.71 11.29-6-6A.996.996 0 1 0 13.3 6.7l4.29 4.29H4c-.55 0-1 .45-1 1s.45 1 1 1h13.59l-4.29 4.29a.996.996 0 0 0 .71 1.7c.26 0 .51-.1.71-.29l6-6a.996.996 0 0 0 0-1.41Z"></path>
                          </svg>
                          <span className={styles.spanText}>{experience}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Skills section placed below */}
        <div className={styles.skills}>
        <h2 className={styles.title}>Skills</h2>
          {skills.map((skill, id) => {
            return (
              <div key={id} className={styles.skill}>
                <div className={styles.skillImageContainer}>
                  <img src={getImageUrl(skill.imageSrc)} alt={skill.title} />
                </div>
                <p>{skill.title}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
