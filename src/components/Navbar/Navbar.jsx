import React, { useEffect, useState } from "react";

import styles from "./Navbar.module.css";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
];

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={styles.header}>
      <div className={`${styles.inner} ${scrolled ? styles.scrolled : ""}`}>
        <a href="#hero" className={styles.logo}>
          diana<span>.exe</span>
        </a>

        <button
          type="button"
          className={styles.menuBtn}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <nav
          aria-label="Main"
          className={`${styles.links} ${menuOpen ? styles.open : ""}`}
        >
          <ul className={styles.list} onClick={() => setMenuOpen(false)}>
            {LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            className={styles.cta}
            onClick={() => setMenuOpen(false)}
          >
            SAY HI
          </a>
        </nav>
      </div>
    </header>
  );
};
