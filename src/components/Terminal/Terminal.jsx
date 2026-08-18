import React, { useEffect, useState } from "react";

import styles from "./Terminal.module.css";
import { PixelFrame } from "../PixelFrame/PixelFrame";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

const CHAR_MS = 32;
const PAUSE_CHARS = 8;

export const Terminal = ({ title, lines }) => {
  const reducedMotion = usePrefersReducedMotion();
  const [typed, setTyped] = useState(0);

  const steps = [];
  lines.forEach((line, index) => {
    for (let i = 1; i <= line.prompt.length; i += 1) {
      steps.push({ index, promptChars: i, showResult: false });
    }
    for (let i = 0; i < PAUSE_CHARS; i += 1) {
      steps.push({ index, promptChars: line.prompt.length, showResult: false });
    }
    steps.push({ index, promptChars: line.prompt.length, showResult: true });
    for (let i = 0; i < PAUSE_CHARS; i += 1) {
      steps.push({ index, promptChars: line.prompt.length, showResult: true });
    }
  });

  const total = steps.length;
  const done = reducedMotion || typed >= total;

  useEffect(() => {
    if (reducedMotion) return undefined;

    setTyped(0);
    const id = setInterval(() => {
      setTyped((value) => {
        if (value >= total) {
          clearInterval(id);
          return value;
        }
        return value + 1;
      });
    }, CHAR_MS);

    return () => clearInterval(id);
  }, [reducedMotion, total]);

  const current = done ? null : steps[typed];

  return (
    <PixelFrame size="lg" innerClassName={styles.terminal}>
      <div className={styles.bar}>
        <span className={`${styles.dot} ${styles.red}`} />
        <span className={`${styles.dot} ${styles.yellow}`} />
        <span className={`${styles.dot} ${styles.green}`} />
        <span className={styles.barTitle}>{title}</span>
      </div>
      <div className={styles.body}>
        {lines.map((line, index) => {
          const visible = done || index < current.index;
          const active = !done && index === current.index;

          if (!visible && !active) return null;

          const promptText = visible
            ? line.prompt
            : line.prompt.slice(0, current.promptChars);
          const showResult = visible || current.showResult;

          return (
            <div key={line.prompt}>
              <div className={styles.line}>
                <span className={styles.prompt}>{promptText}</span>
              </div>
              {showResult && (
                <div className={`${styles.line} ${styles.result}`}>
                  {line.result}
                </div>
              )}
            </div>
          );
        })}
        {done && (
          <div className={styles.line}>
            <span className={styles.prompt}>$ </span>
            <span className={styles.cursor} />
          </div>
        )}
      </div>
    </PixelFrame>
  );
};
