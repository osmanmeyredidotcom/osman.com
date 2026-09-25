import Image from "next/image";
import type { ShopExampleVisual } from "@/data/shop-examples";
import type { ProductRecord } from "@/lib/types";
import { RecordSleeve } from "@/components/public/RecordSleeve";

/**
 * Shop preview visuals (25-09-2026). Every card gets a square "product
 * shot" on the soft canvas: the site's own record art and photos where they
 * exist, and simple drawn mock-ups (tee, tote, picks, notebook, card deck,
 * score sheet) in the site's colours with the OM mark where they don't.
 * Drawn in a 400 × 400 box; the OM mark is the site's logo file used as a
 * mask (as on the header record), so it takes any site colour.
 */

const INK = "var(--color-ink)";
const INK_SOFT = "var(--color-ink-soft)";
const INK_FAINT = "var(--color-ink-faint)";
const CANVAS = "var(--color-canvas)";
const LINE_DARK = "var(--color-line-dark)";
const ACCENT = "var(--color-accent)";

/** The OM mark, placed in % of the square. */
function Mark({ x, y, w, color, rotate = 0 }: { x: number; y: number; w: number; color: string; rotate?: number }) {
  return (
    <span
      className="shop-mark"
      aria-hidden="true"
      style={{
        left: `${x - w / 2}%`,
        top: `${y}%`,
        width: `${w}%`,
        background: color,
        transform: rotate ? `translateY(-50%) rotate(${rotate}deg)` : "translateY(-50%)",
      }}
    />
  );
}

function Stage({ children }: { children: React.ReactNode }) {
  return <div className="shop-stage">{children}</div>;
}

function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 400 400" className="shop-svg" aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

function Tee() {
  const body = "M150 70 C168 90 232 90 250 70 L322 96 L356 170 L310 190 L304 348 Q200 360 96 348 L90 190 L44 170 L78 96 Z";
  return (
    <Stage>
      <Svg>
        <path d={body} transform="translate(8 10)" style={{ fill: "black", opacity: 0.35 }} />
        <path d={body} style={{ fill: ACCENT }} />
        {/* shading: a darker right side, soft seams, the collar */}
        <path d="M232 84 L250 70 L322 96 L356 170 L310 190 L304 348 Q262 354 232 356 Z" style={{ fill: "black", opacity: 0.1 }} />
        <path d="M104 88 Q98 140 92 188" style={{ fill: "none", stroke: "black", strokeWidth: 2, opacity: 0.18 }} />
        <path d="M296 88 Q302 140 308 188" style={{ fill: "none", stroke: "black", strokeWidth: 2, opacity: 0.18 }} />
        <path d="M150 70 C168 90 232 90 250 70" style={{ fill: "none", stroke: "black", strokeWidth: 7, opacity: 0.22 }} />
      </Svg>
      <Mark x={50} y={38} w={17} color={CANVAS} />
    </Stage>
  );
}

function Tote() {
  return (
    <Stage>
      <Svg>
        <path d="M152 150 C152 66 248 66 248 150" style={{ fill: "none", stroke: INK_SOFT, strokeWidth: 13, strokeLinecap: "round" }} />
        <rect x="118" y="150" width="180" height="212" rx="6" style={{ fill: "black", opacity: 0.35 }} />
        <rect x="110" y="140" width="180" height="212" rx="6" style={{ fill: INK }} />
        <rect x="110" y="140" width="180" height="16" style={{ fill: "black", opacity: 0.07 }} />
        <rect x="262" y="140" width="28" height="212" style={{ fill: "black", opacity: 0.05 }} />
        <path d="M152 150 L152 170 M248 150 L248 170" style={{ stroke: INK_SOFT, strokeWidth: 13 }} />
      </Svg>
      <Mark x={50} y={62} w={22} color={CANVAS} />
    </Stage>
  );
}

function Picks() {
  const pick = "M0 -58 C34 -58 52 -40 50 -14 C48 14 22 44 0 58 C-22 44 -48 14 -50 -14 C-52 -40 -34 -58 0 -58 Z";
  return (
    <Stage>
      <Svg>
        <g transform="translate(142 222) rotate(-20)">
          <path d={pick} style={{ fill: CANVAS, stroke: LINE_DARK, strokeWidth: 2 }} />
        </g>
        <g transform="translate(258 222) rotate(18)">
          <path d={pick} style={{ fill: ACCENT }} />
        </g>
        <g transform="translate(208 214) rotate(-2) scale(1.18)">
          <path d={pick} transform="translate(5 6)" style={{ fill: "black", opacity: 0.35 }} />
          <path d={pick} style={{ fill: INK }} />
        </g>
      </Svg>
      <Mark x={51.5} y={49} w={13} color={CANVAS} rotate={-2} />
    </Stage>
  );
}

function titleLines(title: string, max = 11): string[] {
  const lines: string[] = [];
  for (const word of title.toUpperCase().split(/\s+/)) {
    const last = lines[lines.length - 1];
    if (last && (last + " " + word).length <= max) lines[lines.length - 1] = `${last} ${word}`;
    else lines.push(word);
  }
  return lines.slice(0, 4);
}

function Notebook({ title }: { title: string }) {
  return (
    <Stage>
      <Svg>
        <rect x="128" y="66" width="170" height="262" rx="8" style={{ fill: "black", opacity: 0.35 }} />
        <rect x="286" y="60" width="6" height="254" rx="2" style={{ fill: INK_FAINT, opacity: 0.6 }} />
        <rect x="118" y="56" width="170" height="262" rx="8" style={{ fill: CANVAS, stroke: LINE_DARK, strokeWidth: 1.5 }} />
        <rect x="256" y="56" width="9" height="262" style={{ fill: ACCENT }} />
        <text x="136" y="104" style={{ fill: INK_SOFT, fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 700, letterSpacing: 1 }}>
          {titleLines(title).map((line, i) => (
            <tspan key={i} x="136" dy={i === 0 ? 0 : 23}>
              {line}
            </tspan>
          ))}
        </text>
      </Svg>
      <Mark x={40} y={73} w={11} color={INK_FAINT} />
    </Stage>
  );
}

function CardDeck({ title }: { title: string }) {
  const hits = [1, 0, 1, 0, 0, 1, 1, 0];
  return (
    <Stage>
      <Svg>
        <g transform="rotate(-9 200 200)">
          <rect x="130" y="84" width="140" height="216" rx="10" style={{ fill: CANVAS, stroke: LINE_DARK, strokeWidth: 1.5 }} />
        </g>
        <g transform="rotate(7 200 200)">
          <rect x="130" y="84" width="140" height="216" rx="10" style={{ fill: CANVAS, stroke: LINE_DARK, strokeWidth: 1.5 }} />
        </g>
        <rect x="136" y="92" width="140" height="216" rx="10" style={{ fill: "black", opacity: 0.35 }} />
        <rect x="130" y="84" width="140" height="216" rx="10" style={{ fill: INK }} />
        {hits.map((on, i) => (
          <circle
            key={i}
            cx={152 + (i % 4) * 32}
            cy={118 + Math.floor(i / 4) * 30}
            r="9"
            style={on ? { fill: ACCENT } : { fill: "none", stroke: CANVAS, strokeWidth: 2 }}
          />
        ))}
        <text x="146" y="236" style={{ fill: CANVAS, fontFamily: "var(--font-display)", fontSize: 21, fontWeight: 700, letterSpacing: 1 }}>
          {titleLines(title, 9).map((line, i) => (
            <tspan key={i} x="146" dy={i === 0 ? 0 : 24}>
              {line}
            </tspan>
          ))}
        </text>
      </Svg>
    </Stage>
  );
}

function ScoreSheet({ title }: { title: string }) {
  const notes = [
    [140, 116], [158, 110], [176, 118], [206, 106], [226, 114], [252, 110],
    [146, 154], [170, 150], [196, 158], [232, 148], [258, 156],
    [150, 196], [184, 190], [214, 198], [244, 188],
  ];
  return (
    <Stage>
      <Svg>
        <g transform="rotate(-3 200 200)">
          <rect x="120" y="68" width="176" height="276" style={{ fill: "black", opacity: 0.35 }} />
          <rect x="112" y="58" width="176" height="276" style={{ fill: INK }} />
          <text x="128" y="84" style={{ fill: CANVAS, fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 700, letterSpacing: 1.2 }}>
            {title.toUpperCase()}
          </text>
          {[0, 1, 2, 3, 4].map((staff) =>
            [0, 1, 2, 3, 4].map((line) => (
              <line
                key={`${staff}-${line}`}
                x1="126"
                x2="274"
                y1={104 + staff * 42 + line * 5}
                y2={104 + staff * 42 + line * 5}
                style={{ stroke: CANVAS, strokeWidth: 0.8, opacity: 0.55 }}
              />
            ))
          )}
          {notes.map(([x, y], i) => (
            <g key={i}>
              <ellipse cx={x} cy={y + 4} rx="4.2" ry="3" transform={`rotate(-22 ${x} ${y + 4})`} style={{ fill: CANVAS }} />
              <line x1={x + 3.8} x2={x + 3.8} y1={y + 3} y2={y - 14} style={{ stroke: CANVAS, strokeWidth: 1 }} />
            </g>
          ))}
          <line x1="126" x2="274" y1="300" y2="300" style={{ stroke: ACCENT, strokeWidth: 2 }} />
        </g>
      </Svg>
    </Stage>
  );
}

/** Visual for a preview example. */
export function ExampleVisual({ visual }: { visual: ShopExampleVisual }) {
  switch (visual.kind) {
    case "record":
      return (
        <Stage>
          <div className="shop-record">
            <RecordSleeve
              title={visual.title}
              year={visual.year}
              artworkUrl={visual.artworkUrl}
              withVinyl
              spinVinyl={false}
              vinylClassName="transition-transform duration-500 ease-(--ease-out-cubic) group-hover/shop:translate-x-[17%]"
              className="pr-[15%]"
            />
          </div>
        </Stage>
      );
    case "print": {
      const landscape = visual.width >= visual.height;
      return (
        <Stage>
          <div className={`shop-print ${landscape ? "is-landscape" : ""}`}>
            <Image
              src={visual.src}
              alt={visual.alt}
              width={visual.width}
              height={visual.height}
              sizes="(min-width: 1024px) 22vw, 45vw"
              className="block h-auto w-full"
            />
          </div>
        </Stage>
      );
    }
    case "tee":
      return <Tee />;
    case "tote":
      return <Tote />;
    case "picks":
      return <Picks />;
  }
}

/** Visual for a Studio concept product: its own photo, or a drawn mock-up by category. */
export function ConceptVisual({ product }: { product: ProductRecord }) {
  if (product.imageUrl) {
    return (
      <div className="shop-photo">
        <Image src={product.imageUrl} alt="" fill sizes="(min-width: 1024px) 22vw, 45vw" className="object-cover" />
      </div>
    );
  }
  const category = product.category.toLowerCase();
  if (category.includes("printed matter") || category.includes("notebook")) return <Notebook title={product.title} />;
  if (category.includes("studio") || category.includes("card")) return <CardDeck title={product.title} />;
  if (category.includes("edition") || category.includes("print") || category.includes("score")) {
    return <ScoreSheet title={product.title} />;
  }
  return <Notebook title={product.title} />;
}
