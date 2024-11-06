import React from "react";

import styles from "./Hero.module.css";
import { getImageUrl } from "../../utils";

export const Hero = () => {
  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Hi, I'm Diana</h1>
        <p className={styles.description}>
          I'm a recent graduate with a degree in Information Systems Engineering, passionate about systems and related fields. Reach out if you'd like to learn more!
        </p>

      </div>
      <img
        src={getImageUrl("hero/dianaprofile.png")}
        alt="Hero image of me"
        className={styles.heroImg}
        style={{ width: "450px", height: "450px" }}
      />
      <div className={styles.topBlur} />
      <div className={styles.bottomBlur} />
    </section>
  );
};
