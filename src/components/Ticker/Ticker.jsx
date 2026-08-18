import React from "react";

import styles from "./Ticker.module.css";

const MESSAGE =
  "DATA ANALYST  •  VALIDATION · REPORTING · DASHBOARDS  •  CGPA 3.17  •  SPRINT · SIT · UAT · FAT  •  GOVERNMENT TECHNOLOGY PROJECTS  •  ";

export const Ticker = () => (
  <div className={styles.ticker} aria-hidden="true">
    <div className={styles.track}>
      <span className={styles.item}>{MESSAGE}</span>
      <span className={styles.item}>{MESSAGE}</span>
    </div>
  </div>
);
