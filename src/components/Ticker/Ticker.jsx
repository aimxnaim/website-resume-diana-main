import React from "react";

import styles from "./Ticker.module.css";

const MESSAGE =
  "INFORMATION SYSTEMS ENGINEERING  •  PHP · LARAVEL · REACT · JAVA  •  CGPA 3.44  •  2 TECH INTERNSHIPS  •  BUILDING SYSTEMS SINCE 2021  •  ";

export const Ticker = () => (
  <div className={styles.ticker} aria-hidden="true">
    <div className={styles.track}>
      <span className={styles.item}>{MESSAGE}</span>
      <span className={styles.item}>{MESSAGE}</span>
    </div>
  </div>
);
