import React from "react";

import styles from "./Hero.module.css";
import { getImageUrl } from "../../utils";

export const Hero = () => {
  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Hi, I'm Diana</h1>
        <p className={styles.description}>
          I'm a recent graduate with a degree in Information Systems Engineering, 
          passionate about systems and related fields. I have hands-on experience with programming languages such as Java, 
          PHP, HTML, CSS, Python, and JavaScript. Additionally, I have a solid understanding of Laravel framework concepts and 
          possess a strong skill set in system development programming and system documentation. With my knowledge and passion 
          for these areas, I am well-equipped to contribute to projects that involve in PHP Laravel Framework and also system 
          development.
        </p>


      </div>
      <img
        src={getImageUrl("hero/dianaprofile.png")}
        alt="Hero image of me"
        className={styles.heroImg}
        style={{ width: "400px", height: "400px" }}
      />
      <div className={styles.topBlur} />
      <div className={styles.bottomBlur} />
    </section>
  );
};
