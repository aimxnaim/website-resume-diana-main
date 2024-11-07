import React, { useState } from "react";

import styles from "./Navbar.module.css";
import { getImageUrl } from "../../utils";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logoTitle}>
        <img src={getImageUrl("logo/nslogo.png")} alt="logo" className={styles.logo} style={{ height: "40px" }} />
        {/* <a className={styles.title} href="/">nrdiananrzn</a> */}
      </div>
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
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
              <img
                src={getImageUrl("navbar/linkedin.png")}
                alt="linkedin"
                className={styles.aboutImage}
              />
            </a>
          </li>
          <li>
            <a href="https://www.github.com" target="_blank" rel="noopener noreferrer">
              <img
                src={getImageUrl("navbar/github.png")}
                alt="github"
                className={styles.aboutImage}
              />
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/nrdiananrzn/?next=%2F&hl=en" target="_blank" rel="noopener noreferrer">
              <img
                src={getImageUrl("navbar/ig.png")}
                alt="instagram"
                className={styles.aboutImage}
              />
            </a>
          </li>
          <li>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
              <img
                src={getImageUrl("navbar/resume.png")}
                alt="resume"
                className={styles.aboutImage}
              />
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};
