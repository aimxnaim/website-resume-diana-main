import React from "react";

import styles from "./About.module.css";
import { getImageUrl } from "../../utils";

export const About = () => {
  return (
    
    <section className={styles.container} id="about">
      <h2 className={styles.title}>About Me</h2>
      <div className={styles.content}>
      <img
          src={getImageUrl("about/aboutdiana.png")} 
          alt="smile hold ipad"
          className={styles.aboutImage}
        />
        <ul className={styles.aboutItems}>
          <li className={styles.aboutItem}>
            <div className={styles.aboutItemText}>
              <h3></h3>
              <p>
              Throughout my university studies, I have gained nearly 2 years of hands-on programming experience, 
              particularly excelling in building websites from the ground up. 
              My front-end skills include technologies such as CSS, Bootstrap, React.js, and Mobirise. Additionally, 
              I possess back-end expertise in Node.js, Laravel, Laragon, and XAMPP, 
              allowing me to build full-stack applications that are both dynamic and responsive.</p>
            </div>
          </li>
          <li className={styles.aboutItem}>            
            <img src={getImageUrl("about/serverIcon.png")} alt="Server icon" />            
            <div className={styles.aboutItemText}>              
              <h3>University Of Technology MARA, Jasin</h3>             
              <p>
                Bachelor of Information Systems (Hons.) Information Systems Engineering - CGPA : 3.44
              </p>            
            </div>          
          </li>

          <li className={styles.aboutItem}>
            <img src={getImageUrl("about/uiIcon.png")} alt="UI icon" /> 
            <div className={styles.aboutItemText}>
              <h3>University Of Technology MARA, Jasin</h3>
              <p>
              Diploma in Computer Science 
              - CGPA : 3.30
              </p>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
};

