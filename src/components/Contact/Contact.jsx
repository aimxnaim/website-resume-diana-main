import React from "react";

import styles from "./Contact.module.css";
import { useReveal } from "../../hooks/useReveal";

export const CONTACT_EMAIL = "nordianasahira1002@gmail.com";

const LINKEDIN_URL = "https://www.linkedin.com/in/nordiana-sahira/";

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/Dodidee" },
  { label: "LinkedIn", href: LINKEDIN_URL },
  {
    label: "Instagram",
    href: "https://www.instagram.com/nrdiananrzn/?next=%2F&hl=en",
  },
];

export const Contact = () => {
  const [ref, inView] = useReveal();

  return (
    <>
      <section className={styles.container} id="contact">
        <div ref={ref} className={`reveal ${inView ? "in-view" : ""}`}>
          <div className="eyebrow">
            <span className="lv">FINAL</span> GET IN TOUCH
          </div>
          <h2 className={styles.heading}>READY PLAYER TWO?</h2>
          <p className={styles.copy}>
            Open to work in data analysis, data validation and system
            implementation. If you have datasets that need making sense of, or a
            system that needs getting live, let&apos;s talk.
          </p>

          <div className={styles.actions}>
            {CONTACT_EMAIL ? (
              <a href={`mailto:${CONTACT_EMAIL}`} className="btn btn-primary">
                ✉ EMAIL ME
              </a>
            ) : (
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                ▶ CONNECT ON LINKEDIN
              </a>
            )}
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              ⬇ RÉSUMÉ
            </a>
          </div>

          <div className={styles.socials}>
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.pill}
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>Built and designed by Nordiana Sahira</span>
        <span>© 2026. All Rights Reserved.</span>
      </footer>
    </>
  );
};
