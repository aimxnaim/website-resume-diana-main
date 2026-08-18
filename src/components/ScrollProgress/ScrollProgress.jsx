import React, { useEffect, useRef } from "react";

import styles from "./ScrollProgress.module.css";

export const ScrollProgress = () => {
  const fillRef = useRef(null);

  useEffect(() => {
    const update = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;

      if (fillRef.current) {
        fillRef.current.style.width = `${pct}%`;
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className={styles.track} aria-hidden="true">
      <div className={styles.fill} ref={fillRef} />
    </div>
  );
};
