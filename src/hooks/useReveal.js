import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

export const useReveal = () => {
  const ref = useRef(null);
  const reducedMotion = usePrefersReducedMotion();
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node) return undefined;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return [ref, inView];
};
