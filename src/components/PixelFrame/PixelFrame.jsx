import React from "react";

const SIZE_CLASS = {
  sm: "pf-sm",
  md: "",
  lg: "pf-lg",
};

// Deliberately carries no CSS module of its own. It previously declared
// `.outer{display:block}` / `.inner{display:block}` — both no-ops on a div —
// which tied at equal specificity with the `innerClassName` a consumer passes
// (e.g. About's `.eduCard{display:flex}`). Which one won came down to CSS
// emission order, so About's education cards silently rendered as `block`
// while Experience's and ProjectCard's rendered as `flex`. Removing the rules
// removes the tie for every consumer at once.
export const PixelFrame = ({
  size = "md",
  className = "",
  innerClassName = "",
  children,
  ...rest
}) => {
  const outer = ["pf-outer", "pf-clip", SIZE_CLASS[size], className]
    .filter(Boolean)
    .join(" ");
  const inner = ["pf-inner", "pf-clip", innerClassName].filter(Boolean).join(" ");

  return (
    <div className={outer} {...rest}>
      <div className={inner}>{children}</div>
    </div>
  );
};
