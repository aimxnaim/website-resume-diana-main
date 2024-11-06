import React, { useState } from "react";

import styles from "./Navbar.module.css";
import { getImageUrl } from "../../utils";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <a className={styles.title} href="/">
        nrdiananrzn
      </a>
      <div className={styles.menu}>
        <img
          className={styles.menuBtn}
          src={
            menuOpen
              ? getImageUrl("nav/closeIcon.png")
              : getImageUrl("nav/menuIcon.png")
          }
          alt="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
        />
        <ul
          className={`${styles.menuItems} ${menuOpen && styles.menuOpen}`}
          onClick={() => setMenuOpen(false)}
        >
         <li>
            <a href="https://github.com/Dodideehttps://www.linkedin.com/in/nordiana-sahira-5b004a215/" target="_blank" rel="noopener noreferrer"></a>
            <img 
            src={getImageUrl("navbar/linkedin.png")} 
            alt="linkedin" 
            className={styles.aboutImage} 
            style={{ width: "40px", height: "40px" }} 
            />
</li>
          <li>
              <a href="https://github.com/Dodidee" target="_blank" rel="noopener noreferrer"></a>
              <img 
                src={getImageUrl("navbar/github.png")} 
                alt="linkedin" 
                className={styles.aboutImage} 
                style={{ width: "40px", height: "40px" }} 
                />
          </li>
          <li>  
              <a href="https://www.instagram.com/nrdiananrzn/?next=%2F&hl=en" target="_blank" rel="noopener noreferrer">
                  <img
                      src={getImageUrl("navbar/ig.png")}
                      alt="instagram"
                      className={styles.aboutImage}
                      style={{ width: "40px", height: "40px" }}
                  />
              </a>
          </li>

          <li>
          <img 
            src={getImageUrl("navbar/resume.png")} 
            alt="linkedin" 
            className={styles.aboutImage} 
            style={{ width: "40px", height: "40px" }} 
            />
          </li>
        </ul>
      </div>
    </nav>
  );
};
