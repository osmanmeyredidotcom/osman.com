import type { ReactNode } from "react";

/**
 * Cohesion pass (24-09-2026, §22–23): the red-line callout as ONE shared
 * component so every instance has the same left edge, line thickness, gap
 * and max width — never positioned per page. Sits flush with the content
 * column that contains it (no per-page x offsets).
 */
export function Callout({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`max-w-xl border-l-2 border-accent pl-5 leading-relaxed text-ink-soft ${className}`}>
      {children}
    </p>
  );
}
