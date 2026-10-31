/**
 * Osman Meyredi logotype — the single-line horizontal wordmark. November
 * feedback (N3): public/images/wordmark.svg is the wordmark line of the
 * supplied official vector lockup (OSMAN MEYREDI LOGO/PDF/OSMAN MEYREDI
 * logo_BLACK .pdf); it replaces the earlier raster trace and the unused
 * two-line trace.
 *
 * Renders the traced brand SVG via a CSS mask (.logo-mark in globals.css),
 * so it inherits the surrounding text color — ink in the header, any theme,
 * no extra assets.
 *
 * Pass `label` when the mark stands alone as meaningful content; omit it
 * inside links that already have an accessible name (the default renders
 * aria-hidden).
 */
export function LogoWordmark({
  className = "",
  label,
}: {
  className?: string;
  label?: string;
}) {
  return (
    <span
      className={`logo-mark ${className}`}
      {...(label
        ? { role: "img", "aria-label": label }
        : { "aria-hidden": true })}
    />
  );
}
