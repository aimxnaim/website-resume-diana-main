import React from "react";

import styles from "./Contact.module.css";
import { getImageUrl } from "../../utils";

export const Contact = () => {
  return (
    <footer id="contact" className={styles.container}>
      <div className={styles.text}>
        <h2>Contact</h2>
        <p>Feel free to reach out! hahahahah</p>
      </div>
      <ul className={styles.links}>
        <li className={styles.link}>
          <img src={getImageUrl("contact/emailIcon.png")} alt="Email icon" style={{ width: "40px" }} />
          <a href="nordianasahira1002@gmail.comoO">nordianasahira1002@gmail.com</a>
        </li>
        <li className={styles.link}>
          <img
            src={getImageUrl("contact/linkedinIcon.png")}
            alt="LinkedIn icon"
            style={{ width: "40px" }}
          />
          <a href="https://www.linkedin.com/in/nordiana-sahira-5b004a215/">linkedin.com/nordiana-sahira</a>
        </li>
        <li className={styles.link}>
          <img src={getImageUrl("contact/githubIcon.png")} alt="Github icon" style={{ width: "40px" }} />
          <a href="https://github.com/Dodidee">github.com/Dodidee</a>
        </li>
      </ul>
    </footer>
  );
};
