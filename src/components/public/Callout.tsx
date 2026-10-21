import type { ReactNode } from "react";

/**
 * Cohesion pass (24-09-2026, §22–23): the callout as ONE shared component so
 * every instance has the same left edge and max width. Global rules
 * (A-GLOBAL_ALIGNMENT_COPY-01): the decorative red vertical rule and its
 * indent are gone, so the text sits on the content edge like the copy
 * around it.
 */
export function Callout({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`max-w-xl leading-relaxed text-ink-soft ${className}`}>
      {children}
    </p>
  );
}
