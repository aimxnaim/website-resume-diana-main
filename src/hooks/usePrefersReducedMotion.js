import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

export const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(
    () => window.matchMedia(QUERY).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const onChange = (event) => setReduced(event.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return reduced;
};
