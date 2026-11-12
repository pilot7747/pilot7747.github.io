// The frame around every chart: a subtitle, the SVG, an HTML legend and notes.

import { paint, type ColorName } from "./parts";

export type LegendItem = {
  label: string;
  color?: ColorName;
  /** How the swatch is drawn; "bar" by default. */
  mark?: "bar" | "line" | "dash" | "dot-line" | "dot" | "hollow" | "square" | "hollow-square" | "diamond" | "triangle" | "tick" | "line-dot" | "line-hollow";
};

function Swatch({ mark = "bar", color = "ink" }: LegendItem) {
  const c = paint(color);
  const ring = { fill: "var(--bg)", stroke: c, strokeWidth: 2 };
  const dot = { fill: c };
  return (
    <svg viewBox="0 0 20 12" width="20" height="12" aria-hidden className="shrink-0">
      {mark === "bar" && <rect x="2" y="2" width="16" height="8" rx="1.5" fill={c} />}
      {(mark === "line" || mark === "line-dot" || mark === "line-hollow") && (
        <line x1="1" x2="19" y1="6" y2="6" stroke={c} strokeWidth="2" strokeLinecap="round" />
      )}
      {mark === "dash" && <line x1="1" x2="19" y1="6" y2="6" stroke={c} strokeWidth="2" strokeDasharray="4 2.5" />}
      {mark === "dot-line" && <line x1="1" x2="19" y1="6" y2="6" stroke={c} strokeWidth="2" strokeDasharray="1.5 2.5" />}
      {(mark === "dot" || mark === "line-dot") && <circle cx="10" cy="6" r="4" style={dot} />}
      {(mark === "hollow" || mark === "line-hollow") && <circle cx="10" cy="6" r="3.5" style={ring} />}
      {mark === "square" && <rect x="6" y="2" width="8" height="8" rx="1" style={dot} />}
      {mark === "hollow-square" && <rect x="6.5" y="2.5" width="7" height="7" rx="1" style={ring} />}
      {mark === "diamond" && <path d="M10 1L15 6L10 11L5 6Z" style={dot} />}
      {mark === "triangle" && <path d="M10 1.5L15 10.5L5 10.5Z" style={dot} />}
      {mark === "tick" && <line x1="10" x2="10" y1="1" y2="11" stroke={c} strokeWidth="2" />}
    </svg>
  );
}

type FigureProps = {
  label: string;
  subtitle?: string;
  legend?: LegendItem[];
  notes?: string[];
  /** Below this width the chart scrolls sideways instead of shrinking its text. */
  minWidth?: number;
  children: React.ReactNode;
};

export function ChartFigure({ label, subtitle, legend, notes, minWidth = 480, children }: FigureProps) {
  return (
    <figure className="chart" role="group" aria-label={label}>
      {subtitle && <p className="chart-subtitle">{subtitle}</p>}
      <div className="chart-scroll">
        <div style={{ minWidth }}>{children}</div>
      </div>
      {legend && legend.length > 0 && (
        <ul className="chart-legend">
          {legend.map((item) => (
            <li key={item.label}>
              <Swatch {...item} />
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      )}
      {notes?.map((n) => (
        <p key={n} className="chart-note">
          {n}
        </p>
      ))}
    </figure>
  );
}
